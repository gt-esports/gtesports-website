import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../src/lib/newsDisplay.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } });
const { parseArticleBody, formatNewsDate, newsCategories } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

test('splits paragraphs on blank lines', () => {
  assert.deepEqual(parseArticleBody('First paragraph.\n\nSecond paragraph.'), [
    { paragraphs: ['First paragraph.', 'Second paragraph.'] },
  ]);
});

test('"## " lines start new sections with headings', () => {
  assert.deepEqual(parseArticleBody('Intro.\n\n## Results\nWe won.\n\nGG.\n## Next up\nFinals.'), [
    { paragraphs: ['Intro.'] },
    { heading: 'Results', paragraphs: ['We won.', 'GG.'] },
    { heading: 'Next up', paragraphs: ['Finals.'] },
  ]);
});

test('keeps single line breaks inside a paragraph and handles Windows line endings', () => {
  assert.deepEqual(parseArticleBody('Line one\r\nLine two\r\n\r\n\r\nNext'), [
    { paragraphs: ['Line one\nLine two', 'Next'] },
  ]);
});

test('empty or whitespace-only bodies produce no sections', () => {
  assert.deepEqual(parseArticleBody(''), []);
  assert.deepEqual(parseArticleBody('  \n\n  '), []);
});

test('"##" without a space is treated as text, not a heading', () => {
  assert.deepEqual(parseArticleBody('##hashtag'), [{ paragraphs: ['##hashtag'] }]);
});

test('formats published_at in Atlanta time and tolerates bad input', () => {
  // 02:00 UTC on Feb 2 is still Feb 1 in Atlanta.
  assert.equal(formatNewsDate('2026-02-02T02:00:00Z'), 'February 1, 2026');
  assert.equal(formatNewsDate('not a date'), '');
});

test('categories match the news_posts category check constraint', () => {
  assert.deepEqual(newsCategories, ['Community', 'Competition', 'Events', 'Announcements']);
});