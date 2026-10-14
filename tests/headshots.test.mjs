import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../src/lib/headshots.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } });
const calls = [];
let uploadError = null;
globalThis.__headshotStorageMock = {
  storage: { from: bucket => ({
    upload: async (path, file, options) => { calls.push({ bucket, path, file, options }); return { error: uploadError }; },
    getPublicUrl: path => ({ data: { publicUrl: `https://example.com/${path}` } }),
  }) },
};
const mockedSource = outputText.replace(/import \{ supabase \} from ['"]\.\/supabase['"];?/, 'const supabase = globalThis.__headshotStorageMock;');
const { validateHeadshot, uploadHeadshot, MAX_HEADSHOT_BYTES } = await import(`data:text/javascript;base64,${Buffer.from(mockedSource).toString('base64')}`);
delete globalThis.__headshotStorageMock;

const webp = await readFile(new URL('../src/assets/headshots/dj-fratt.webp', import.meta.url));
const mislabeledJpeg = await readFile(new URL('../src/assets/headshots/kevinHu.webp', import.meta.url));
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aX1sAAAAASUVORK5CYII=', 'base64');

test('accepts genuine WebP with correct, empty, or generic browser MIME types', async () => {
  for (const type of ['image/webp', '', 'application/octet-stream']) {
    assert.equal(await validateHeadshot(new File([webp], 'photo.webp', { type })), 'webp');
  }
});
test('accepts supported bytes with misleading filenames and MIME types', async () => {
  assert.equal(await validateHeadshot(new File([mislabeledJpeg], 'photo.webp', { type: 'image/webp' })), 'jpg');
  assert.equal(await validateHeadshot(new File([png], 'photo.webp', { type: 'image/webp' })), 'png');
});
test('upload uses detected extension and content type and keeps unique paths', async () => {
  for (const [bytes, extension, contentType] of [[webp, 'webp', 'image/webp'], [mislabeledJpeg, 'jpg', 'image/jpeg'], [png, 'png', 'image/png']]) {
    const file = new File([bytes], 'photo.webp', { type: '' });
    const url = await uploadHeadshot(file);
    const call = calls.at(-1);
    assert.equal(call.bucket, 'team-headshots');
    assert.match(call.path, new RegExp(`^headshots/[a-f0-9-]+\\.${extension}$`));
    assert.equal(call.options.contentType, contentType);
    assert.equal(call.options.upsert, false);
    assert.equal(call.file.type, contentType);
    assert.deepEqual(Buffer.from(await call.file.arrayBuffer()), bytes);
    assert.equal(url, `https://example.com/${call.path}`);
  }
  assert.equal(new Set(calls.map(call => call.path)).size, calls.length);
});
test('rejects unsupported, empty, oversized, and incomplete image headers before uploading', async () => {
  const before = calls.length;
  for (const file of [
    new File(['<svg></svg>'], 'fake.webp', { type: 'image/webp' }),
    new File(['plain text'], 'fake.png', { type: 'image/png' }),
    new File(['RIFF'], 'truncated.webp', { type: 'image/webp' }),
    new File([], 'empty.webp', { type: 'image/webp' }),
    new File([new Uint8Array(MAX_HEADSHOT_BYTES + 1)], 'large.webp', { type: 'image/webp' }),
  ]) await assert.rejects(uploadHeadshot(file));
  assert.equal(calls.length, before);
});
test('surfaces the actual Storage error instead of suggesting every failure is admin access', async () => {
  uploadError = { message: 'new row violates row-level security policy' };
  try {
    await assert.rejects(uploadHeadshot(new File([webp], 'photo.webp', { type: 'image/webp' })), /new row violates row-level security policy/);
  } finally { uploadError = null; }
});
