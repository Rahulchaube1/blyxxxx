# Blyx — GitHub Linguist admission readiness

**Status on November 25, 2026.** The [standalone MIT grammar v0.1.0](https://github.com/Rahulchaube1/language-blyx-grammar/tree/v0.1.0) is public. Independent adoption remains the outstanding eligibility requirement.
This is a preparation checklist, **not** a GitHub Linguist registration submission.

## Official upstream requirements

GitHub Linguist [requires widespread public use](https://github.com/github-linguist/linguist/blob/main/CONTRIBUTING.md#language-extension-and-filename-usage-requirements) before it accepts a new language.
For a conventional source file extension such as `.blyx`, the current threshold is **2,000 files indexed during the preceding year**, excluding forks. Usage must be spread reasonably across **independent owners and repositories**. Maintainers may exclude the language author's files using `-user:<username>`.

The policy is maintained by Linguist; check it again before filing a PR. Do not create thousands of artificial files, copies, forks, or generated examples to reach the threshold.

## Preliminary discovery (not an official adoption count)

On November 25 the authenticated GitHub REST code search reported 3,168 matches for `extension:blyx` and two for `extension:blyx -user:Rahulchaube1`. Both responses reported complete results. These totals describe that API query and do not establish the preceding-year count used by Linguist. The two outside-owner files were [an extension catalog placeholder](https://github.com/GregTrevellick/FilesForEveryExtension/blob/1f489433431c3cd877fa7943ea10101f8669740f/ByLetter/B/GitIgnore.BLYX) and [an archive sample with different syntax](https://github.com/sonusario/The-Sterling-Python-Archive/blob/3ae43974f534ec79f6c773f9355c68bf1b924929/The-Archive/SLUG/BLYX/example.blyx). Neither demonstrates an independently maintained project written in this language.

For a future submission, the [Kinglet checkpoint range implementation](https://github.com/Rahulchaube1/blyx-kinglet/blob/v0.2.0/checkpoint_ranges.blyx) is a non-tutorial sample with an [MIT license option](https://github.com/Rahulchaube1/blyx-kinglet/blob/v0.2.0/LICENSE-MIT). Editor file-tree support is tracked separately in [Pierre Icons PR 17](https://github.com/pierrecomputer/vscode-icons/pull/17).

At the time of this audit, searches of public GitHub code for `.blyx` primarily returned examples from `Rahulchaube1/blyxxxx`. Two repositories with similar names under different accounts (`oyyPoodles/blyxxxx`, `ydvGautam/blyxxxx`) were also located, but **their independent status has not been established**. They must not be presented as separate adoption without verifying origin, fork status and actual development. A filename such as `FilesForEveryExtension/.../GitIgnore.BLYX` is an extension collection, not evidence that someone built a Blyx project.

These observations do **not** establish GitHub's exact indexed-file count, nor its last-year count. Do not present search API sampled totals as the Linguist eligibility figure.

## Run the repeatable public adoption audit

Use Node.js 20+ and a token with permission to query public GitHub code. Never commit tokens or paste them into issues:

```sh
GITHUB_TOKEN=YOUR_TOKEN node tools/audit-blyx-adoption.mjs --limit 50 --output blyx-adoption.json
node --test tools/test-blyx-adoption-audit.mjs
```

On PowerShell, set `$env:GITHUB_TOKEN` in your own terminal, then run the Node command without including a token on the command line. The report includes public search totals and sampled repositories, classifying language-owner files, forks, unknown-fork-status projects and **candidates for manual review**.

**Important limitations:** only the first page is sampled; GitHub Code Search is capped and may be incomplete; it does not establish what was indexed during the preceding year; even a non-fork repository may merely copy official examples. A green test result verifies the audit's classification logic, not GitHub recognition.

Public search URLs for manual verification:
- [All public `.blyx` search hits](https://github.com/search?q=extension%3Ablyx&type=code)
- [Search excluding the primary language owner](https://github.com/search?q=extension%3Ablyx+-user%3ARahulchaube1&type=code)

## Evidence checklist for *real* independent adoption

For each external repository, inspect and record:

- Owner/repository and original source URLs, unique developer, first publication date and primary purpose.
- Whether it is a fork, tutorial mirror, automatically generated collection or genuine separately maintained project.
- Real `.blyx` source files, demonstration instructions, reproducible build/run tests, and actual compiler version.
- License permitting reuse of any proposed source samples.
- Specific source file links that demonstrate distinctive Blyx syntax, not merely Hello World.
- The indexed GitHub search result and the date it was checked.

Only independent software projects should be described as community adoption. A user sharing a working repository is better evidence than many duplicated examples.

## Upstream submission gates

1. GitHub Linguist's in-the-wild adoption policy must be demonstrably satisfied using public search evidence, excluding forks and owner concentration.
2. Use the [published standalone grammar](https://github.com/Rahulchaube1/language-blyx-grammar). Its tagged grammar matches the VS Code grammar at `editors/code/syntaxes/blyx.tmLanguage.json`.
3. Choose **real-world, nontrivial** Blyx samples with verified licenses. Linguist explicitly does not accept Hello World or tutorial-style samples.
4. In an upstream `github-linguist/linguist` checkout, follow [Adding a language](https://github.com/github-linguist/linguist/blob/main/CONTRIBUTING.md#adding-a-language): add an entry in `lib/linguist/languages.yml` (without `language_id` initially), run `script/add-grammar` against the standalone grammar repository, add samples, and run `script/update-ids`.
5. Run Linguist's tests and use its pull-request template; link direct source licenses and public search evidence.

**Do not submit an upstream language-registration PR until these gates pass.** In the meantime, Blyx runs and highlights in its own CLI, playground, and editor extension without official GitHub language classification.

## Practical adoption path

The best work now is to help developers actually complete small Blyx projects. Keep the stable 0.2.0 subset documented; provide reproducible examples and starter repositories; fix user-discovered compiler problems; encourage external projects and reviews; and maintain an honest, public list of independently verified uses.

Community project evidence and reproducible examples can be submitted to the [Blyx community showcase issue #18](https://github.com/Rahulchaube1/blyxxxx/issues/18). Each external project must still be independently reviewed.\n\nSee also [the existing GitHub language-recognition guide](github-language-recognition.md).
