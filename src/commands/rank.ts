import { AttachmentBuilder, type Message } from "discord.js";
import errorEmbed from "../utils/errorEmbed";
import { prisma } from "..";
import fetchUser from "../utils/fetchUser";
import cardBuilder from "../modules/cardBuilder";
import levelCalculate from "../modules/levelCalculate";

export default async (message: Message, args: string[]) => {
    const author = message.mentions.users.hasAny()
        ? message.mentions.users.first()
        : args[0]
            ? await fetchUser(args[0])
            : message.author;

    if (!author) return errorEmbed(message, "User not found");

    const entry = await prisma.user.findUnique({
        where: {
            id: author.id,
        },
    });

    if (!entry)
        return errorEmbed(message, "Profile not found. Start chatting to gain XP.");

    const rank = await prisma.user.count({
        where: {
            allXp: {
                gt: entry.allXp,
            },
        },
    });

    const card = await cardBuilder({
        username: author.displayName,
        avatar: author.displayAvatarURL({ size: 256, extension: "png" }),
        currentXp: entry.currentXp,
        level: entry.level,
        rank: rank + 1,
        maxXp: levelCalculate(entry.level),
        card: entry.card,
    });

    const attachment = new AttachmentBuilder(Buffer.from(card), {
        name: "unrecord-card.jpg",
    });

    message.reply({ files: [attachment] });
}