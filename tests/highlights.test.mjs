import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../src/lib/highlights.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } });
const { getYouTubeEmbedUrl } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

test('normalizes embed, watch, short-link, Shorts and live YouTube URLs', () => {
  const id = 'KtrVy2KLzIo';
  for (const src of [
    `https://www.youtube.com/embed/${id}?si=tracking`,
    `https://www.youtube.com/watch?v=${id}&t=30`,
    `https://youtu.be/${id}?si=tracking`,
    `https://m.youtube.com/shorts/${id}`,
    `https://www.youtube.com/live/${id}`,
    `https://www.youtube-nocookie.com/embed/${id}`,
  ]) assert.equal(getYouTubeEmbedUrl(src), `https://www.youtube-nocookie.com/embed/${id}`);
});
test('rejects invalid identifiers, lookalike domains and non-web protocols', () => {
  for (const src of ['not a URL', 'javascript:alert(1)', 'https://youtube.com.evil.example/watch?v=KtrVy2KLzIo', 'https://example.com/youtube.com/embed/KtrVy2KLzIo', 'https://youtu.be/too-short', 'https://youtube.com/watch?v=KtrVy2KLzIoEXTRA', 'https://example.com/clip.mp4']) {
    assert.equal(getYouTubeEmbedUrl(src), null);
  }
});
