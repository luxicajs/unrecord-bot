import { EmbedBuilder, type Message } from "discord.js";
import levelCalculate from "../modules/levelCalculate";
import fetchUser from "../utils/fetchUser";
import errorEmbed from "../utils/errorEmbed";
import { prisma } from "..";

const embedEntry = async (
    entry: {
        id: string;
        level: number;
        currentXp: number;
        allXp: number;
        card: number;
    },
    index: number,
    page: number,
) => {
    const user = await fetchUser(entry.id);
    return {
        name: `${index + (page > 1 ? page - 1 : 0) * 10}. ${user ? user.displayName : "Unknown"}`,
        value: `XP: ${new Intl.NumberFormat().format(entry.currentXp)}/${new Intl.NumberFormat().format(levelCalculate(entry.level))} | Level ${entry.level}`,
    };
};

export default async (message: Message, page: number) => {
    const t1 = new Date().getTime();
    if (page < 0 || !Number.isInteger(page))
        return errorEmbed(message, "Invalid page number");

    const rankings = await prisma.user.findMany({
        orderBy: {
            allXp: "desc",
        },
        take: 10,
        skip: (page > 0 ? page - 1 : 0) * 10,
    });

    const leaderboardEmbed = new EmbedBuilder()
        .setTitle(":trophy: Unrecord Leveling Leaderboard")
        .setDescription(`[Web leaderboard](${Bun.env.FRONTEND_URL}/leaderboard)`)
        .setColor(0xb10dc9);

    if (rankings.length === 0)
        return errorEmbed(message, "Page number out of bounds.");

    (
        await Promise.all(
            rankings.map((item, index) => embedEntry(item, index + 1, page)),
        )
    ).map((field) => leaderboardEmbed.addFields(field));

    if (!message.channel.isSendable()) return;

    const timeElapsed = new Date().getTime() - t1;

    leaderboardEmbed.setFooter({
        text: `Cache: ${timeElapsed > 10 ? "MISS" : "HIT"}. Took ${timeElapsed}ms.`,
    });

    message.channel.send({ embeds: [leaderboardEmbed] });
};
