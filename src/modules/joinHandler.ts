import type { GuildMember } from "discord.js";

// On the server we have an auto-role system. You're free to remove this file if you don't need it.
// but you'll need to remove the event in index.ts as well.
export default async (member: GuildMember) => {
    member.roles.add("1088840255018373150");
}