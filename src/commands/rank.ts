import { AttachmentBuilder, type Message } from "discord.js";
import errorEmbed from "../utils/errorEmbed";
import { prisma } from "..";
import fetchUser from "../utils/fetchUser";
import cardBuilder from "../modules/cardBuilder";
import levelCalculate from "../modules/levelCalculate";

export default async (message: Message, args: string[]) => {
    // See if there's a command argument. Maybe the user wants to see someone else's rank.
    const author = message.mentions.users.hasAny()
        ? message.mentions.users.first()
        : args[0]
            ? await fetchUser(args[0])
            : message.author;

    // If the user from the argument is not found, return an error.
    if (!author) return errorEmbed(message, "User not found");

    // Fetch details related to the user from the db.
    const entry = await prisma.user.findUnique({
        where: {
            id: author.id,
        },
    });

    // User doesn't have an entry in the DB. They have not sent any messages prior.
    if (!entry)
        return errorEmbed(message, "Profile not found. Start chatting to gain XP.");

    // This query gets their place in the rankings by sorting all the xp they have accumulated.
    const rank = await prisma.user.count({
        where: {
            allXp: {
                gt: entry.allXp,
            },
        },
    });

    // Builds the image using our custom renderer.

    const card = await cardBuilder({
        username: author.displayName,
        avatar: author.displayAvatarURL({ size: 256, extension: "png" }),
        currentXp: entry.currentXp,
        level: entry.level,
        rank: rank + 1,
        maxXp: levelCalculate(entry.level),
        card: entry.card,
    });
    
    // Prepare the buffer
    const attachment = new AttachmentBuilder(Buffer.from(card), {
        name: "unrecord-card.jpg",
    });

    // Sends the image as a reply.

    message.reply({ files: [attachment] });
}