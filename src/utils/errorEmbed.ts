import { EmbedBuilder, type Message } from "discord.js";

// A simple error showcase utility.
export default (message: Message, content: string) => {
  const errorEmbed = new EmbedBuilder()
    .setTitle(":x: Error")
    .setDescription(content)
    .setColor(0xff4136);

  return message.reply({
    embeds: [errorEmbed],
  });
};
