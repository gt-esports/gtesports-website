import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

// Exercise the pure CSV/validation module without requiring a browser or secrets.
const source = await readFile(new URL('../src/data/marketingContacts.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } });
const { parseContactCsv, exportContactCsv, normalizeContact, emptyContact } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

test('spreadsheet CSV supports BOM, CRLF, escaped quotes, commas and multiline notes', () => {
  const { contacts } = parseContactCsv('\uFEFFEmail,Name,Organization,Contact Group,Status,Last Contacted,Notes\r\n PERSON@Example.com ,"Person, A","Club ""One""",both,Unsubscribed,2026-10-13,"Line one\nLine two"\r\n');
  assert.deepEqual(contacts[0], { ...emptyContact, email: 'person@example.com', name: 'Person, A', organization: 'Club "One"', contact_group: 'both', status: 'unsubscribed', last_contacted: '2026-10-13', notes: 'Line one\nLine two' });
});
test('normalizes duplicate emails and preserves the first row', () => {
  const result = parseContactCsv('email,status\na@example.com,do_not_contact\n A@EXAMPLE.COM ,active\nb@example.com,');
  assert.equal(result.duplicates, 1);
  assert.equal(result.contacts.length, 2);
  assert.equal(result.contacts[0].status, 'do_not_contact');
  assert.equal(result.contacts[1].status, 'active');
});
test('invalid rows fail the whole preview with a record number', () => {
  for (const source of ['email\na@example.com\ninvalid', 'email,status\na@example.com,unknown', 'email,contact_group\na@example.com,unknown', 'email,last_contacted\na@example.com,2026-02-30', 'email,name\na@example.com']) {
    assert.throws(() => parseContactCsv(source), /CSV record/);
  }
});
test('rejects malformed CSV and missing/duplicate headers', () => {
  for (const source of ['email\n"unfinished', 'name\nA', 'email,email\na@example.com,b@example.com', 'email\n"a@example.com"trailing', 'email\na"@example.com']) assert.throws(() => parseContactCsv(source));
});
test('limits imports and fields', () => {
  assert.throws(() => parseContactCsv('email\n' + Array.from({ length: 501 }, (_, i) => `a${i}@example.com`).join('\n')), /500/);
  assert.throws(() => normalizeContact({ ...emptyContact, email: 'a@example.com', notes: 'x'.repeat(5001) }), /5,000/);
});
test('exports retain contact statuses and quoted notes', () => {
  const input = { ...emptyContact, email: 'a@example.com', status: 'do_not_contact', notes: 'One, "two"\nThree' };
  assert.deepEqual(parseContactCsv(exportContactCsv([input])).contacts, [input]);
});
test('export neutralizes spreadsheet formulas', () => {
  const csv = exportContactCsv([{ ...emptyContact, email: 'a@example.com', name: '=HYPERLINK("bad")', organization: '+123', category: '@bad', notes: '-formula' }]);
  assert.match(csv, /"'=HYPERLINK/);
  assert.match(csv, /"'\+123"/);
  assert.match(csv, /"'@bad"/);
  assert.match(csv, /"'-formula"/);
});
test('validation strips database metadata from editable payloads', () => {
  const result = normalizeContact({ ...emptyContact, email: ' A@Example.com ', id: 'unexpected', revision: 99 });
  assert.equal(result.email, 'a@example.com');
  assert.equal('id' in result, false);
  assert.equal('revision' in result, false);
});
