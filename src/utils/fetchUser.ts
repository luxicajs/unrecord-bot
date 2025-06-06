import { bot } from "..";
import { tryCatch } from "./tryCatch";

export default async (id: string) => {
    const guild = bot.guilds.cache.get(Bun.env.GUILD_ID);

    if (!guild) return null;

    const cached = bot.users.cache.get(id);

    if (cached) return cached;

    const guildFetch = await tryCatch(guild.members.fetch(id));

    console.log(guildFetch.data ? "Guild fetch" : "User fetch");

    if (guildFetch.data && !guildFetch.error) return guildFetch.data;

    const globalFetch = await tryCatch(bot.users.fetch(id));

    if (globalFetch.data && !globalFetch.error) return globalFetch.data;

    return null;
};
