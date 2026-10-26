import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { importTypescript } from './helpers/importTypescript.mjs';

const { readSupabaseConfiguration, validateBuildConfiguration } = await importTypescript(new URL('../src/lib/publicConfig.ts', import.meta.url));
const fixture = {
  VITE_SUPABASE_URL: 'https://example.supabase.co',
  VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_fixture',
  VITE_ESPORTS_API_URL: 'https://api.example.test/base',
};
const legacyKey = (role) => `${Buffer.from('{"alg":"HS256","typ":"JWT"}').toString('base64url')}.${Buffer.from(JSON.stringify({ role })).toString('base64url')}.fixture`;

test('configuration accepts publishable and legacy anon keys without claiming authentication', () => {
  assert.deepEqual(readSupabaseConfiguration(fixture), { url: fixture.VITE_SUPABASE_URL, publishableKey: fixture.VITE_SUPABASE_PUBLISHABLE_KEY });
  assert.doesNotThrow(() => validateBuildConfiguration({ ...fixture, VITE_SUPABASE_PUBLISHABLE_KEY: legacyKey('anon') }));
  assert.doesNotThrow(() => validateBuildConfiguration({ ...fixture, VITE_SUPABASE_URL: 'http://127.0.0.1:54321', VITE_ESPORTS_API_URL: 'http://localhost:8000' }));
});

test('every required build variable fails closed when absent or blank', () => {
  for (const name of Object.keys(fixture)) {
    for (const missing of [undefined, '', '   ']) {
      assert.throws(() => validateBuildConfiguration({ ...fixture, [name]: missing }), error => error.message === `${name} is required.`);
    }
  }
});

test('privileged and session keys are rejected without reproducing the supplied key', () => {
  for (const key of ['sb_secret_do_not_print_me', legacyKey('service_role'), legacyKey('authenticated'), 'private-fixture-value', 'sb_publishable_', 'bad.invalid.jwt']) {
    assert.throws(() => validateBuildConfiguration({ ...fixture, VITE_SUPABASE_PUBLISHABLE_KEY: key }), error =>
      error.message.includes('VITE_SUPABASE_PUBLISHABLE_KEY') && !error.message.includes(key));
  }
});

test('both URLs reject remote HTTP, credentials, queries and fragments without revealing values', () => {
  for (const name of ['VITE_SUPABASE_URL', 'VITE_ESPORTS_API_URL']) {
    for (const url of ['http://remote.invalid', '/relative', 'https://user:do-not-print@remote.invalid', 'https://remote.invalid?secret=do-not-print', 'https://remote.invalid#private']) {
      assert.throws(() => validateBuildConfiguration({ ...fixture, [name]: url }), error =>
        error.message.includes(name) && !error.message.includes(url) && !error.message.includes('do-not-print'));
    }
  }
});

test('Vite build configuration enforces the gate before bundling and does not echo secrets', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'gt-frontend-build-config-'));
  const configFile = fileURLToPath(new URL('../vite.config.ts', import.meta.url));
  const script = `
    import { loadConfigFromFile } from ${JSON.stringify(import.meta.resolve('vite'))};
    try {
      await loadConfigFromFile({ command: 'build', mode: 'production' }, ${JSON.stringify(configFile)}, ${JSON.stringify(directory)}, 'silent');
      console.log('configuration accepted');
    } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
    }
  `;
  const run = env => spawnSync(process.execPath, ['--input-type=module', '-e', script], {
    cwd: directory,
    env: { PATH: process.env.PATH, ...env },
    encoding: 'utf8', timeout: 15_000,
  });
  try {
    const accepted = run(fixture);
    assert.equal(accepted.status, 0, accepted.stderr);
    assert.match(accepted.stdout, /configuration accepted/);

    const absentApi = run({ ...fixture, VITE_ESPORTS_API_URL: '' });
    assert.notEqual(absentApi.status, 0);
    assert.match(absentApi.stderr, /VITE_ESPORTS_API_URL is required/);

    const secret = 'sb_secret_never_print_this_fixture';
    const rejectedKey = run({ ...fixture, VITE_SUPABASE_PUBLISHABLE_KEY: secret });
    assert.notEqual(rejectedKey.status, 0);
    assert.match(rejectedKey.stderr, /VITE_SUPABASE_PUBLISHABLE_KEY must be/);
    assert.equal(`${rejectedKey.stdout}${rejectedKey.stderr}`.includes(secret), false);

    const rejectedUrl = run({ ...fixture, VITE_ESPORTS_API_URL: 'https://user:never-print@api.example.test' });
    assert.notEqual(rejectedUrl.status, 0);
    assert.match(rejectedUrl.stderr, /VITE_ESPORTS_API_URL must be/);
    assert.equal(`${rejectedUrl.stdout}${rejectedUrl.stderr}`.includes('never-print'), false);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
