import type { Message } from "discord.js";
import { bot, prisma } from "..";
import levelCalculate from "./levelCalculate";

const minXp = Number(Bun.env.MIN_XP);
const maxXp = Number(Bun.env.MAX_XP);
const xpTimeout = Number(Bun.env.XP_TIMEOUT);

const recentUsers = new Set();

export default async (message: Message) => {
  // If a user is in a timeout, break here.
  if (recentUsers.has(message.author.id)) return;

  // Randomize xp from the range.
  const xp = Math.floor(Math.random() * (maxXp - minXp + 1)) + minXp;

  // Add user to the timeout.
  recentUsers.add(message.author.id);

  // Remove the user from the timeout after a given time.
  setTimeout(() => recentUsers.delete(message.author.id), xpTimeout);

  // Let's see if the user exists in our database.
  let user = await prisma.user.findUnique({
    where: {
      id: message.author.id,
    },
  });

  // If not, let's create a new entry.
  if (!user)
    user = await prisma.user.create({
      data: {
        id: message.author.id,
      },
    });

  // If user is not on the verge of leveling up, we update their stats
  // and break here.
  if (user.currentXp + xp < levelCalculate(user.level)) {
    await prisma.user.update({
      where: user,
      data: {
        currentXp: user.currentXp + xp,
        allXp: user.allXp + xp,
      },
    });

    return;
  }

  // User has leveled up, let's update both their XP and level.
  await prisma.user.update({
    where: user,
    data: {
      currentXp: user.currentXp + xp - levelCalculate(user.level),
      level: user.level + 1,
      allXp: user.allXp + xp,
    },
  });

  const levelingChannel = bot.channels.cache.get(Bun.env.LEVELING_CHANNEL);

  if (!levelingChannel?.isSendable()) return;

  // Send a level up message and grant a role if it matches the following cases.

  switch (user.level + 1) {
    case 5:
      message.member?.roles.add("1101265905247338607");
      levelingChannel.send(
        `Hello <@${message.author.id}>, you are now ${user.level + 1} and that means you have gained new server perks.\nYou can now post suggestions, use voice chat, react to messages.`,
      );
      break;
    case 15:
      message.member?.roles.add("1099690872972517406");
      levelingChannel.send(
        `Hello <@${message.author.id}>, you are now ${user.level + 1} and that means you have gained new server perks.\nYou can now send embeds and attachments, and customize your rank card. Use \`${Bun.env.PREFIX}settings\` to learn more. Happy chatting. :wave:`,
      );
      break;
  }

  if (user.level <= 4) return; // If user is below level 5, don't send a level up message.

  if (
    (user.level + (1 % 2) === 0 && user.level + 1 !== 15) ||
    user.level + 1 !== 5
  ) {
    if (!levelingChannel?.isSendable()) return;

    levelingChannel.send(
      `Hi <@${message.author.id}>, level up! You are now Level \`${user.level + 1}\`!`,
    );
  }
};
