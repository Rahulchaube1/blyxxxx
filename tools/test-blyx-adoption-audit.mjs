import assert from 'node:assert/strict';
import { test } from 'node:test';
import { classifyFile, parseArgs, summarizeSearch } from './audit-blyx-adoption.mjs';

const item = (owner, repo, path, fork) => ({
  path,
  html_url: 'https://github.com/' + owner + '/' + repo + '/blob/main/' + path,
  repository: {
    full_name: owner + '/' + repo,
    owner: { login: owner },
    ...(fork === undefined ? {} : { fork }),
  },
});

test('excludes language owner files, forks, and wrong extension', () => {
  assert.equal(classifyFile(item('Rahulchaube1', 'blyxxxx', 'src/model.blyx')), 'language-owner');
  assert.equal(classifyFile(item('other', 'fork', 'main.blyx', true)), 'fork');
  assert.equal(classifyFile(item('other', 'repo', 'data.txt', false)), 'wrong-extension');
});

test('only verified non-forks become manual-review candidates', () => {
  const external = item('independent', 'example', 'src/main.blyx');
  assert.equal(classifyFile(external), 'unverified');
  assert.equal(classifyFile(external, { fork: false, private: false }), 'candidate-for-manual-review');
  assert.equal(classifyFile(external, { fork: true }), 'fork');
  assert.equal(classifyFile(external, { fork: false, private: true }), 'private');
});

test('summarizes search samples without asserting eligibility', () => {
  const results = summarizeSearch({
    total_count: 2001,
    incomplete_results: true,
    items: [
      item('Rahulchaube1', 'blyxxxx', 'a.blyx'),
      item('community', 'demo', 'a.blyx'),
      item('community', 'demo', 'b.blyx'),
      item('other', 'forked', 'main.blyx', true),
    ],
  }, { 'community/demo': { fork: false, archived: false } });
  assert.equal(results.searchReportedTotal, 2001);
  assert.equal(results.incompleteResults, true);
  assert.equal(results.sampledFiles, 4);
  assert.equal(results.sampleClassification['candidate-for-manual-review'], 2);
  assert.equal(results.sampleClassification['language-owner'], 1);
  assert.equal(results.sampleClassification.fork, 1);
  assert.equal(results.sampledRepositories.find(r => r.repository === 'community/demo').sampledFiles, 2);
});

test('rejects malformed CLI arguments', () => {
  assert.deepEqual(parseArgs(['--limit', '3', '--owner', 'BlyxTeam']), { limit: 3, owner: 'BlyxTeam', output: null });
  assert.throws(() => parseArgs(['--limit', '200']), /limit/);
  assert.throws(() => parseArgs(['--owner', 'not/valid']), /owner/);
});
