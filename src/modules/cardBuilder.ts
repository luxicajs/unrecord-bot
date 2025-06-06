import satori from "satori";
import card from "../card";
import sharp from "sharp";

interface Opts {
    username: string;
    avatar: string;
    currentXp: number;
    level: number;
    rank: number;
    maxXp: number;
    card: number;
}

// Load fonts
const geistFont = await Bun.file("./assets/Geist-Regular.ttf").arrayBuffer();
const geistBoldFont = await Bun.file("./assets/Geist-Bold.ttf").arrayBuffer();

export default async (data: Opts) => {
    // Start measuring the amount of time the rank card takes.
    performance.mark("genStart");

    // Fetch the background the user has set.
    const bg = await Bun.file(
        `./assets/card${data.card + 1}.png`,
    ).arrayBuffer();

    // Generate the svg from "card.tsx"
    const svg = await satori(
        card({
            bg,
            avatar: data.avatar,
            username: data.username,
            currentXp: data.currentXp,
            maxXp: data.maxXp,
            progressWidth: (data.currentXp / data.maxXp).toFixed(2),
            level: data.level,
            rank: data.rank,
        }),
        {
            width: 934,
            height: 282,
            fonts: [
                {
                    name: "Geist",
                    data: geistFont,
                    weight: 400,
                },
                {
                    name: "Geist",
                    data: geistBoldFont,
                    weight: 800,
                },
            ],
        },
    );

    // Convert the svg to a jpeg.
    const output = await sharp(Buffer.from(svg)).jpeg({ quality: 95 }).toBuffer();

    // Stop measuring.
    performance.mark("genEnd");

    console.log(
        "Took",
        performance.measure("render", "genStart", "genEnd").duration,
        "ms to generate the rank card.",
    );

    // Returns the image buffer.
    return output;
}