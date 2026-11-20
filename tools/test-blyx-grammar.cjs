// Lightweight regression checks for the shipped TextMate grammar.
// Run from the repository root: node tools/test-blyx-grammar.cjs
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const grammar = JSON.parse(fs.readFileSync(
  path.join(root, 'editors/code/syntaxes/blyx.tmLanguage.json'), 'utf8'
));
const extension = JSON.parse(fs.readFileSync(
  path.join(root, 'editors/code/package.json'), 'utf8'
));

assert.equal(grammar.scopeName, 'source.blyx');
assert.ok(extension.contributes.languages.some(
  (language) => language.id === 'blyx' && language.extensions.includes('.blyx')
));
assert.ok(extension.contributes.grammars.some(
  (entry) => entry.language === 'blyx' && entry.scopeName === grammar.scopeName
));

for (const pattern of grammar.patterns) {
  assert.ok(grammar.repository[pattern.include.slice(1)],
    `Missing grammar rule: ${pattern.include}`);
}
function matches(section, source, scope) {
  return grammar.repository[section].patterns.some((entry) =>
    entry.name === scope && new RegExp(entry.match).test(source)
  );
}
assert.ok(matches('keywords', 'let x = true;', 'keyword.other.blyx'));
assert.ok(matches('keywords', 'async fn task()', 'keyword.control.concurrency.blyx'));
assert.ok(matches('numbers', 'let value = 1.5e-3;', 'constant.numeric.blyx'));
assert.ok(matches('macros', 'println!(x)', 'entity.name.function.macro.blyx'));
assert.ok(matches('types', 'fn f(x: vector) -> f64', 'support.type.primitive.blyx'));
assert.ok(matches('operators', 'a -> b', 'keyword.operator.blyx'));
for (const section of Object.values(grammar.repository)) {
  for (const rule of section.patterns) {
    if (rule.match) new RegExp(rule.match);
    if (rule.begin) new RegExp(rule.begin);
    if (rule.end) new RegExp(rule.end);
  }
}
console.log('Blyx grammar JSON, extension registration, and regex checks passed');
