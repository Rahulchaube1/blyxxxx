# Blyx syntax highlighting and GitHub language recognition

Blyx source code uses the `.blyx` extension. The VS Code extension already
registers `.blyx` with the `source.blyx` TextMate grammar in
`editors/code/syntaxes/blyx.tmLanguage.json`.

## Test the local grammar

From the repository root:

```sh
node tools/test-blyx-grammar.cjs
```

This verifies valid JSON, VS Code language registration, referenced grammar
sections, and representative regex patterns. It does **not** run the VS Code
TextMate tokenizer or prove GitHub.com syntax highlighting.

## What GitHub Linguist needs

GitHub repository language statistics are computed using GitHub Linguist, not
the installed VS Code extension. Publishing a compiler, a VS Code extension,
or a file extension does **not** automatically register a new language with
Linguist. Adding `*.blyx linguist-language=Blyx` to `.gitattributes` also
does not register an unknown language.

To prepare a future upstream contribution:

1. Maintain representative, freely licensed `.blyx` source files and the
   language specification; keep grammar rules consistent with the lexer.
2. Use the [standalone MIT grammar v0.1.0](https://github.com/Rahulchaube1/language-blyx-grammar/tree/v0.1.0).
   The [recognition checklist](linguist-readiness.md) records the latest adoption audit and a licensed code sample.
3. Check whether public GitHub adoption meets Linguist's current eligibility
   criteria. Their guidelines require **at least 2,000 indexed files in the
   preceding year** for a repeatedly used extension such as `.blyx`,
   excluding forks, with reasonable distribution across independent users
   and repositories. Verify the policy again before submitting.
4. When eligible, follow the upstream language addition instructions to
   register the extension and grammar, add licensed samples, and run upstream
   tests. Submit a pull request to `github-linguist/linguist` and respond to
   maintainer feedback.

References:
- https://github.com/github-linguist/linguist/blob/main/CONTRIBUTING.md
- https://github.com/github-linguist/linguist/blob/main/docs/troubleshooting.md

## Why the repository still shows Rust, TypeScript, etc.

Those are the recognized implementation languages used to build Blyx. Until
Linguist recognizes `.blyx` as Blyx, GitHub's language bar may exclude Blyx
files or classify them as another known language. Do not force their
classification as Rust: that would produce misleading language statistics.

The project can still use its VS Code extension and language documentation
while official recognition and broader adoption are pursued.
