import { EmbedBuilder, type Message } from "discord.js";

// A simple error showcase utility.
export default (message: Message, content: string) => {
    const errorEmbed = new EmbedBuilder()
        .setTitle(":x: Error")
        .setDescription(content)
        .setColor(0xFF4136);

    return message.reply({
        embeds: [errorEmbed]
    });
}