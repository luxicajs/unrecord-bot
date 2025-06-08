import { ChannelType, type Message } from "discord.js";
import leveling from "./leveling";
import rank from "../commands/rank";
import help from "../commands/help";
import leaderboard from "../commands/leaderboard";
import restore from "../commands/restore";
import settings from "../commands/cardSettings";

const prefix = Bun.env.PREFIX;
export default async (message: Message) => {
    // Discard anything sent in DMs or by a bot.
    if (message.channel.type === ChannelType.DM || message.author.bot) return;

    // Leveling calculations and all.
    await leveling(message);

    // Ignore every message that doesn't start with our prefix.
    if (!message.content.startsWith(prefix)) return;

    // Fetch command arguments if they exist.
    const args = message.content.slice(prefix.length).trim().split(/ +/g);

    // Fetch the command name.
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
        case "card":
        case "settings":
        case "c":
            settings(message, args || []);
            break;
    }
}