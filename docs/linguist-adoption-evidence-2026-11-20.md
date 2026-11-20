# Blyx public adoption evidence — 2026-11-20

This is a **manual, date-scoped inspection of visible public GitHub code search results**, not a comprehensive census of indexed files, and not an assertion of GitHub Linguist eligibility.

## Search method

Query: [`extension:blyx -user:Rahulchaube1`](https://github.com/search?q=extension%3Ablyx+-user%3ARahulchaube1&type=code), excluding the language creator's GitHub account. A read-only connected GitHub code search returned **two visible matches** at inspection time. GitHub search indexing, permissions, pagination, caps, and refresh timing may change the visible set.

### Outside-owner matches inspected

| Repository and file | File inspected | Finding | Qualifies as independent Blyx usage? |
| --- | --- | --- | --- |
| [GregTrevellick/FilesForEveryExtension](https://github.com/GregTrevellick/FilesForEveryExtension/blob/1f489433431c3cd877fa7943ea10101f8669740f/ByLetter/B/GitIgnore.BLYX) | Content `Foo bar BLYX` | Placeholder file in a file-extension catalogue | **No** |
| [sonusario/The-Sterling-Python-Archive](https://github.com/sonusario/The-Sterling-Python-Archive/blob/3ae43974f534ec79f6c773f9355c68bf1b924929/The-Archive/SLUG/BLYX/example.blyx) | Uses `kp(arg,val) # {`, `x $ {`, `NULL` | Not compatible with the public Blyx 0.2.0 syntax as documented; appears to represent another use of the extension | **No** |

### Author-maintained results

Another query excluding just the main repo, [`extension:blyx -repo:Rahulchaube1/blyxxxx`](https://github.com/search?q=extension%3Ablyx+-repo%3ARahulchaube1%2Fblyxxxx&type=code), returns files from additional repositories owned by the same author, including `blyxbot` and `rahulchaube-runtime`. These may be useful as *Blyx use cases*, but they do **not** independently demonstrate third-party adoption.

The repository's [community showcase issue #18](https://github.com/Rahulchaube1/blyxxxx/issues/18) was checked during this audit and had **zero comments**. No independent project had been submitted there.

## Result and caveats

- **0 independently verified Blyx projects** from this inspected search sample.
- **2 unrelated external file hits** individually inspected.
- **No verified total of indexed .blyx files during the preceding year**, and no verified last-year distribution.
- This is **not** a claim that zero third-party Blyx projects exist anywhere on GitHub.

**Upstream decision: DO NOT SUBMIT an official language registration PR at this stage.** GitHub Linguist currently requires at least **2,000 indexed files from the last year** for an extension expected to appear more than once per repository, plus broad distribution across independent developers. See the [Linguist contribution rules](https://github.com/github-linguist/linguist/blob/main/CONTRIBUTING.md#language-extension-and-filename-usage-requirements).

## Next verifiable evidence

Review new public projects posted to [issue #18](https://github.com/Rahulchaube1/blyxxxx/issues/18), reproduce their compiler command and inspect source history before labeling any project independent. Continue running `tools/audit-blyx-adoption.mjs` with an authenticated GitHub code-search token and record dated evidence without inflating the official count.

When legitimate external adoption reaches the upstream policy threshold, export the standalone grammar, obtain appropriately licensed real-world sample programs, and submit a complete upstream PR with usage search URLs, grammar repository URL and test output.
