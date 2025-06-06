import { EmbedBuilder, type Message } from "discord.js";

// Send command

export default async (message: Message) => {
    const helpEmbed = new EmbedBuilder()
        .setTitle("> :question: **Unrecord Bot Help**")
        .addFields(
            {
                name: `> ${Bun.env.PREFIX}r or ${Bun.env.PREFIX}rank`,
                value:
                    "Shows your current level information. You may also tag a user with the command to see their level information.",
            },
            {
                name: `> ${Bun.env.PREFIX}lb or ${Bun.env.PREFIX}leaderboard`,
                value: "Shows the leveling leaderboard.",
            },
            {
                name: `> ${Bun.env.PREFIX}settings`,
                value: "Allows you to modify your rank card. Level 15 Perk",
            },
            {
                name: `> ${Bun.env.PREFIX}restore`,
                value: "Restores your leveling roles & perks.",
            },
        )
        .setColor(0xb10dc9);

    return message.reply({ embeds: [helpEmbed] });
};
