import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const read = async path => readFile(new URL(path, root), 'utf8');

test('Blyx export is identical to the VS Code grammar', async () => {
  const canonical = JSON.parse(await read('editors/code/syntaxes/blyx.tmLanguage.json'));
  const exported = JSON.parse(await read('linguist-grammar/grammars/blyx.tmLanguage.json'));
  assert.deepEqual(exported, canonical);
  assert.equal(exported.scopeName, 'source.blyx');
  assert.equal(exported.name, 'Blyx');
  assert.ok(Array.isArray(exported.patterns) && exported.patterns.length);
});

test('standalone package declares the language and TextMate scope', async () => {
  const pkg = JSON.parse(await read('linguist-grammar/package.json'));
  assert.equal(pkg.license, 'MIT');
  assert.equal(pkg.private, true);
  assert.ok(pkg.contributes.languages.some(lang =>
    lang.id === 'blyx' && lang.extensions.includes('.blyx')
  ));
  assert.ok(pkg.contributes.grammars.some(grammar =>
    grammar.language === 'blyx' &&
    grammar.scopeName === 'source.blyx' &&
    grammar.path === './grammars/blyx.tmLanguage.json'
  ));
});

test('exported grammar is explicitly MIT licensed', async () => {
  const sourceLicense = await read('editors/code/LICENSE');
  const exportLicense = await read('linguist-grammar/LICENSE');
  assert.equal(exportLicense, sourceLicense);
  assert.match(exportLicense, /MIT License/);
});
