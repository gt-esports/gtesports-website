import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../src/features/competitors/model.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } });
const { onboardingStatus, filterCompetitors, competitorReturnPath } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const teams = [{ id: 'a', name: 'Gold', game: 'Valorant', season: 'Spring 2027' }, { id: 'b', name: 'White', game: 'Rocket League', season: 'Fall 2026' }];
const entries = [
  { id: '1', team_id: 'a', preferred_name: 'Kevin', email: 'kevin@example.com', discord: 'kh', game_account: 'IGN#123', onboarding: 'invited', status: 'active', invite_expires_at: '2020-01-01T00:00:00Z' },
  { id: '2', team_id: 'b', preferred_name: 'Chloe', email: 'chloe@example.com', onboarding: 'complete', status: 'former', invite_expires_at: null },
];
test('expiration is derived without conflating competitive status and onboarding', () => {
  assert.equal(onboardingStatus(entries[0]), 'expired');
  assert.equal(onboardingStatus(entries[1]), 'complete');
  assert.equal(onboardingStatus({ ...entries[0], onboarding: 'in_progress' }), 'in_progress');
  assert.equal(onboardingStatus(entries[0], Date.parse('2019-12-31')), 'invited');
  assert.equal(onboardingStatus(entries[0], Date.parse('2020-01-01')), 'expired');
});
test('directory searches game, season and player details while combining filters', () => {
  assert.deepEqual(filterCompetitors(entries, teams, ' spring 2027 ', 'a', 'expired', 'active').map(x => x.id), ['1']);
  assert.deepEqual(filterCompetitors(entries, teams, 'IGN#123', '', '', '').map(x => x.id), ['1']);
  assert.deepEqual(filterCompetitors(entries, teams, 'rocket league', '', 'complete', 'former').map(x => x.id), ['2']);
  assert.deepEqual(filterCompetitors(entries, teams, 'Kevin', 'b', '', ''), []);
});
test('auth return destination never trusts arbitrary paths or URLs', () => {
  for (const value of [null, '', 'https://example.com', '//example.com', '/admin']) {
    assert.equal(competitorReturnPath({ getItem: () => value }), '/home');
  }
  assert.equal(competitorReturnPath({ getItem: () => 'yes' }), '/competitors/onboarding');
});
