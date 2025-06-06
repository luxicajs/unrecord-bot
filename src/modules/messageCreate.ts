import { ChannelType, type Message } from "discord.js";
import leveling from "./leveling";
import rank from "../commands/rank";
import help from "../commands/help";
import leaderboard from "../commands/leaderboard";
import restore from "../commands/restore";

const prefix = Bun.env.PREFIX;

export default async (message: Message) => {
    if (message.channel.type === ChannelType.DM || message.author.bot) return;

    await leveling(message);

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);

    const command = args.shift()?.toLowerCase();

    switch (command) {
        case "xp":
        case "r":
        case "rank":
            rank(message, args || []);
            break;
        case "h":
        case "help":
            help(message);
            break;
        case "lb":
        case "leaderboard":
        case "rankings":
            leaderboard(message, Math.round(Number(args[0])) || 0);
            break;
        case "restore":
            restore(message);
            break;
    }
}