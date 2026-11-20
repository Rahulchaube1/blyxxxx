#!/usr/bin/env node
/**
 * Evidence-gathering aid for Blyx language adoption on public GitHub.
 * This is NOT a substitute for the GitHub Linguist in-the-wild usage criterion.
 * Usage: GITHUB_TOKEN=... node tools/audit-blyx-adoption.mjs [--limit 50] [--output report.json]
 */
import { writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export const DEFAULT_OWNER = 'Rahulchaube1';
const API = 'https://api.github.com';

export function classifyFile(item, repositoryMetadata, owner = DEFAULT_OWNER) {
  const path = item?.path || '';
  const repository = item?.repository || {};
  const fullName = repository.full_name || '';
  const repositoryOwner = repository.owner?.login || fullName.split('/')[0];
  if (!/\.blyx$/i.test(path)) return 'wrong-extension';
  if (repositoryOwner.toLowerCase() === owner.toLowerCase()) return 'language-owner';
  if (repositoryMetadata?.fork === true || repository.fork === true) return 'fork';
  if (repositoryMetadata?.private === true || repository.private === true) return 'private';
  if (repositoryMetadata?.fork !== false && repository.fork !== false) return 'unverified';
  return 'candidate-for-manual-review';
}

export function summarizeSearch(data, metadata = {}, owner = DEFAULT_OWNER) {
  const items = Array.isArray(data?.items) ? data.items : [];
  const byRepository = new Map();
  const counts = {
    'candidate-for-manual-review': 0,
    'language-owner': 0,
    fork: 0,
    private: 0,
    unverified: 0,
    'wrong-extension': 0,
  };
  for (const item of items) {
    const fullName = item?.repository?.full_name || '';
    const classification = classifyFile(item, metadata[fullName], owner);
    counts[classification] += 1;
    if (!fullName || classification === 'wrong-extension') continue;
    let candidate = byRepository.get(fullName);
    if (!candidate) {
      candidate = {
        repository: fullName, classification,
        fork: metadata[fullName]?.fork ?? item.repository?.fork ?? null,
        archived: metadata[fullName]?.archived ?? null,
        sampledFiles: 0, exampleUrls: [],
      };
      byRepository.set(fullName, candidate);
    }
    candidate.sampledFiles += 1;
    if (candidate.exampleUrls.length < 3 && typeof item.html_url === 'string') {
      candidate.exampleUrls.push(item.html_url);
    }
  }
  return {
    searchReportedTotal: Number.isSafeInteger(data?.total_count) ? data.total_count : null,
    incompleteResults: data?.incomplete_results ?? null,
    sampledFiles: items.length,
    sampleClassification: counts,
    sampledRepositories: [...byRepository.values()].sort((a,b) => b.sampledFiles - a.sampledFiles),
  };
}

export function parseArgs(argv) {
  const args = { limit: 50, output: null, owner: DEFAULT_OWNER };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--limit') {
      const n = Number(argv[++i]);
      if (!Number.isInteger(n) || n < 1 || n > 100) throw new Error('--limit must be between 1 and 100');
      args.limit = n;
    } else if (arg === '--output') {
      args.output = argv[++i];
      if (!args.output || args.output.startsWith('--')) throw new Error('--output needs a path');
    } else if (arg === '--owner') {
      args.owner = argv[++i];
      if (!/^[A-Za-z0-9-]{1,39}$/.test(args.owner || '')) throw new Error('--owner needs a valid GitHub username');
    } else {
      throw new Error('Unknown argument: ' + arg);
    }
  }
  return args;
}

async function githubGet(path, token) {
  const response = await fetch(API + path, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: 'Bearer ' + token,
      'User-Agent': 'blyx-linguist-readiness-audit',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  if (!response.ok) {
    let detail = '';
    try { detail = (await response.json()).message || ''; } catch { /* no structured response */ }
    throw new Error('GitHub API ' + response.status + ': ' + (detail || response.statusText));
  }
  return response.json();
}

async function searchCode(query, limit, token) {
  const params = new URLSearchParams({ q: query, per_page: String(limit), page: '1' });
  return githubGet('/search/code?' + params.toString(), token);
}

export async function audit({ owner, limit }, token) {
  const queries = {
    all: 'extension:blyx',
    excludingLanguageOwner: 'extension:blyx -user:' + owner,
  };
  const snapshots = {};
  for (const [label, query] of Object.entries(queries)) {
    const data = await searchCode(query, limit, token);
    const metadata = {};
    const uniqueRepositories = [...new Set(
      (data.items || []).map(item => item?.repository?.full_name).filter(Boolean),
    )];
    for (const fullName of uniqueRepositories) {
      const [repositoryOwner] = fullName.split('/');
      if (repositoryOwner.toLowerCase() === owner.toLowerCase()) continue;
      try {
        const safeName = fullName.split('/').map(encodeURIComponent).join('/');
        const info = await githubGet('/repos/' + safeName, token);
        metadata[fullName] = { fork: info.fork, private: info.private, archived: info.archived };
      } catch (error) {
        metadata[fullName] = { verificationError: String(error) };
      }
    }
    snapshots[label] = { query, ...summarizeSearch(data, metadata, owner) };
  }
  return {
    generatedAt: new Date().toISOString(), ownerExcluded: owner, snapshots,
    limitations: [
      'GitHub Code Search may return capped or incomplete results; only one page per query was sampled.',
      'Search totals are NOT verified counts of indexed files from the preceding year.',
      'Candidate repositories are NOT necessarily independent Blyx projects; inspect content and history.',
      'Do not count forks, copied examples, generated code, or maintainer-controlled projects as independent adoption.',
      'Linguist maintainers determine eligibility from public GitHub search and independent distribution.',
    ],
    readyForUpstreamSubmission: null,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN or GH_TOKEN is required for authenticated GitHub code search');
  const report = await audit(args, token);
  const result = JSON.stringify(report, null, 2) + '\n';
  if (args.output) await writeFile(args.output, result, 'utf8');
  process.stdout.write(result);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => {
    console.error('Blyx adoption audit failed: ' + error.message);
    process.exitCode = 1;
  });
}
