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

const geistFont = await Bun.file("./assets/Geist-Regular.ttf").arrayBuffer();
const geistBoldFont = await Bun.file("./assets/Geist-Bold.ttf").arrayBuffer();

export default async (data: Opts) => {
    performance.mark("genStart");

    const bg = await Bun.file(
        `./assets/card${data.card + 1}.png`,
    ).arrayBuffer();

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

    const output = await sharp(Buffer.from(svg)).jpeg({ quality: 95 }).toBuffer();

    performance.mark("genEnd");

    console.log(
        "Took",
        performance.measure("render", "genStart", "genEnd").duration,
        "ms",
    );

    return output;
}