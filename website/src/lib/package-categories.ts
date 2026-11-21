export const packageDirectories = [
    {
        category: "framework",
        title: "Frameworks",
        href: "/frameworks",
        description: "Run a complete workflow. Train a neural network with BlyxTorch or check audio samples for clipping with Warbler.",
        logo: "/packages/warbler.png",
        placeholder: "Try training, clipping, or routing",
    },
    {
        category: "library",
        title: "Libraries",
        href: "/libraries",
        description: "Import functions into your Blyx program. Measure audio levels with FrameSignal or summarize observations with Moments.",
        logo: "/packages/framesignal.png",
        placeholder: "Try audio, statistics, or calibration",
    },
] as const;

export type PackageCategory = (typeof packageDirectories)[number]["category"];

export function directoryFor(category: string) {
    const directory = packageDirectories.find((item) => item.category === category);
    if (!directory) throw new Error("Unknown Blyx package category: " + category);
    return directory;
}
