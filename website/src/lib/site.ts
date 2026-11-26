export const repository = "https://github.com/Rahulchaube1/blyxxxx";
export const release = repository + "/releases/tag/v0.2.2";
export const assets = repository + "/releases/download/v0.2.2/";
export const docs = "https://doc.blyx-lang.space";
export const website = "https://www.blyx-lang.space";
export const nestRegistry = "https://nest.blyx-lang.space";
export const buyMeACoffee = "https://buymeacoffee.com/rahulchaube";
export const githubSponsors = "https://github.com/sponsors/Rahulchaube1";
export const bookEdition = process.env.NEXT_PUBLIC_BLYX_EDITION === "docs";
export const mainLink = (path: string) => (bookEdition ? website + path : path);
export const guideLink = (slug?: string) =>
    (bookEdition ? "" : docs) + (slug ? "/guide/" + slug : "/");
export const playLink = (id: string) =>
    mainLink("/play?example=" + encodeURIComponent(id));
