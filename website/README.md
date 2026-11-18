# Blyx website and language guide

The main website and the guide at [doc.blyx-lang.space](https://doc.blyx-lang.space/) use the same Next.js application. Install dependencies with `npm ci` inside this directory and run `npm run dev` for the main site. To develop or build the documentation edition, set `NEXT_PUBLIC_BLYX_EDITION=docs` before starting Next.js. Each edition has its own home page, navigation, robots file, and sitemap.

The Vercel project `website` serves the main site. The project `book` serves the documentation edition. Deploy this directory as the project root in both cases. The guide chapters live in `src/lib/guides.json` and the old book URL mappings live in `legacy-book.json`.

The runnable catalog in `src/lib/samples.json` mirrors source programs in the repository's `examples/` directory. From the repository root, run `node editors/code/scripts/prepare.cjs` and `node tools/test-editor-runtime.mjs` to check the embedded programs and their expected output against the WebAssembly runtime. Run `npm run build` in this directory to type-check and build the website.
