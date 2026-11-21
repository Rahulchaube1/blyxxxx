# Blyx TextMate grammar (standalone export source)

This directory is **repository-ready source** for a dedicated MIT-licensed TextMate grammar project. It is maintained in the Blyx language repository until a standalone public Git repository is published. **It is not itself a standalone repository yet.**

- Grammar: `grammars/blyx.tmLanguage.json` (scope `source.blyx`)
- Extension: `.blyx`
- License: MIT (see `LICENSE`)
- Metadata: `package.json`

The canonical grammar used by the VS Code extension lives at `editors/code/syntaxes/blyx.tmLanguage.json`. Changes must be made there and mirrored here. CI runs `node --test tools/test-blyx-grammar-export.mjs` to ensure the two grammars stay equivalent.

## Create a dedicated public repository when appropriate

From a clean checkout of the full Blyx repository:

```sh
git subtree split --prefix=linguist-grammar -b blyx-grammar-export
```

Create a **new public** GitHub repository, for example `language-blyx-grammar`, then push the exported branch as that repository's `main`. Review the history and metadata before publishing. Update the package repository URL to the actual new URL once it exists.

Do **not** point GitHub Linguist's `script/add-grammar` at the monorepo: it adds the entire repository, not just one grammar file. Use the new dedicated grammar repository URL instead.

## Validation and current limits

Run `node --test tools/test-blyx-grammar-export.mjs` from the Blyx monorepo root. It checks package metadata, license, JSON, and equality with the VS Code grammar. These tests do not validate Oniguruma tokenization or run Linguist's grammar import script.

Official registration in `github-linguist/linguist` must wait for the required independently verified public adoption of `.blyx` files. See `../docs/linguist-readiness.md` and `../docs/linguist-adoption-evidence-2026-11-20.md`.

## Connect with Rahul Chaube

[Portfolio](https://www.rahulchaube1.com/) · [GitHub](https://github.com/Rahulchaube1) · [LinkedIn](https://www.linkedin.com/in/rahulchaube1) · [Hugging Face](https://huggingface.co/oncody) · [X](https://x.com/RahulChaube_) · [EverestQ](https://www.everestqai.com/) · [Contact](https://www.rahulchaube1.com/contact)

[Blyx website](https://www.blyx-lang.space/) · [BlyxTorch](https://www.blyx-lang.space/packages/blyxtorch) · [Handbook](https://doc.blyx-lang.space/) · [Community](https://www.blyx-lang.space/community)

Support Rahul’s open-source work through [GitHub Sponsors](https://github.com/sponsors/Rahulchaube1) or [Buy Me a Coffee](https://buymeacoffee.com/rahulchaube).
