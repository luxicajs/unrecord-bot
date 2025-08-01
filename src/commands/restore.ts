import type { Message } from "discord.js";
import { prisma } from "..";
import errorEmbed from "../utils/errorEmbed";

// This command is used to restore a user's roles if they left the server.
export default async (message: Message) => {
  const user = await prisma.user.findUnique({
    where: {
      id: message.author.id,
    },
  });

  if (!user)
    return errorEmbed(
      message,
      "You do not have a profile on our bot. Start chatting to gain XP.",
    );

  if (user.level >= 5) {
    message.member?.roles.add("1101265905247338607");
  }

  if (user.level >= 15) {
    message.member?.roles.add("1099690872972517406");
  }

  message.react("✅");
};
