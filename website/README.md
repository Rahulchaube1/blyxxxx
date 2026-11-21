# Blyx website and documentation

This Next.js application serves the language website and its documentation. The example catalog, editable playground, and runnable guide chapters share a WebAssembly build of the Blyx interpreter. A reader can change the source of a program and see its output in the browser. [Website](https://www.blyx-lang.space/) · [Documentation](https://doc.blyx-lang.space/) · [Example catalog](https://www.blyx-lang.space/examples)

## Run a local edition

Use Node.js 20.9 or newer and npm. From the repository root, start the main website with these commands.

```sh
cd website
npm ci
npm run dev
```

Open `http://localhost:3000`. To start the documentation edition, stop the dev server and run one of these commands from `website/`.

| Shell | Start the documentation edition |
| --- | --- |
| Bash or zsh | `NEXT_PUBLIC_BLYX_EDITION=docs npm run dev` |
| PowerShell | `$env:NEXT_PUBLIC_BLYX_EDITION = 'docs'` followed by `npm run dev` |

The edition is selected at startup and build time. To switch back in PowerShell, run `Remove-Item Env:NEXT_PUBLIC_BLYX_EDITION` and restart the server. Both editions use the same routes and components, with edition-specific home pages, navigation, robots files, and sitemaps.

## Change content

| What you want to change | Where it lives |
| --- | --- |
| An example program | Its `.blyx` file in [examples](../examples/) and its catalog entry in [samples.json](src/lib/samples.json). The entry includes the source path, runnable code, and expected output. |
| A documentation chapter | [guides.json](src/lib/guides.json). Each chapter has sections, practice, a hint and a worked solution. Reference a catalog example by ID to embed an editor. Supply the exercise edits and expected output so CI can execute the solution. |
| An ecosystem release | Update its version, commit, logo, API and example in the [catalog data](src/lib/packages.json). This supplies the searchable directory, detail pages and JSON feed. [Package contributor guide](../docs/ecosystem-packages.md) |
| A page or editor control | [App routes](src/app/) and [shared components](src/components/). |
| A redirect from the old book | [Legacy route map](legacy-book.json) and [redirect configuration](next.config.mjs). |

For example, `weighted-mean` links the catalog to a source file that prints `7.5`. Edit the readings, update the expected result, and run the example checks before opening a pull request. [Source program](../examples/numerics/weighted_mean.blyx) · [Live program](https://www.blyx-lang.space/play?example=weighted-mean)

## Verify and build

Run the example checks from the **repository root**. They compare the catalog with the checked-in source files, execute the examples in WebAssembly, and exercise the editor worker.

```sh
node editors/code/scripts/prepare.cjs
node tools/test-editor-runtime.mjs
node tools/export-handbook.mjs --check
```

After editing chapters or examples, run `node tools/export-handbook.mjs` to refresh the plain-text copies in the repository. Both sites generate their plain-text editions from the same content.

From `website/`, run `npm run build` to type-check and create a production build. Use `npm start` to serve that build locally. For the documentation build, set `NEXT_PUBLIC_BLYX_EDITION=docs` before running the build command. Vercel uses `website/` as the project root for both deployments. The `website` project hosts the main site and the `book` project hosts the guide. [Runtime rebuild instructions](../docs/executable-subset.md) · [Test harness](../tools/test-editor-runtime.mjs)

## Project

Rahul Chaube leads the Blyx project. For site corrections, include the page URL, the affected text or program, and the expected behavior. [Project repository](https://github.com/Rahulchaube1/blyxxxx) · [Issue tracker](https://github.com/Rahulchaube1/blyxxxx/issues) · [Rahul on GitHub](https://github.com/Rahulchaube1) · [Rahul on LinkedIn](https://www.linkedin.com/in/rahulchaube1)

## Connect with Rahul Chaube

[Portfolio](https://www.rahulchaube1.com/) · [GitHub](https://github.com/Rahulchaube1) · [LinkedIn](https://www.linkedin.com/in/rahulchaube1) · [Hugging Face](https://huggingface.co/oncody) · [X](https://x.com/RahulChaube_) · [EverestQ](https://www.everestqai.com/) · [Contact](https://www.rahulchaube1.com/contact)

[Blyx website](https://www.blyx-lang.space/) · [BlyxTorch](https://www.blyx-lang.space/packages/blyxtorch) · [Handbook](https://doc.blyx-lang.space/) · [Community](https://www.blyx-lang.space/community)

Support Rahul’s open-source work through [GitHub Sponsors](https://github.com/sponsors/Rahulchaube1) or [Buy Me a Coffee](https://buymeacoffee.com/rahulchaube).
