import { EmbedBuilder, type Message } from "discord.js";
import levelCalculate from "../modules/levelCalculate";
import fetchUser from "../utils/fetchUser";
import errorEmbed from "../utils/errorEmbed";
import { prisma } from "..";

// This function serves as a utility to build the message content.
const embedEntry = async (
  entry: {
    id: string;
    level: number;
    currentXp: number;
    allXp: number;
    card: number;
  },
  index: number,
  page: number,
) => {
  const user = await fetchUser(entry.id);
  return {
    name: `${index + (page > 1 ? page - 1 : 0) * 10}. ${user ? user.displayName : "Unknown"}`,
    value: `XP: ${new Intl.NumberFormat().format(entry.currentXp)}/${new Intl.NumberFormat().format(levelCalculate(entry.level))} | Level ${entry.level}`,
  };
};

export default async (message: Message, page: number) => {
  // Measure the time it takes to find all users.
  const t1 = new Date().getTime();

  // Is the page argument a valid number?
  if (page < 0 || !Number.isInteger(page))
    return errorEmbed(message, "Invalid page number");

  // Fetch 10 users from a given page, sorted by accumulated XP.
  const rankings = await prisma.user.findMany({
    orderBy: {
      allXp: "desc",
    },
    take: 10,
    skip: (page > 0 ? page - 1 : 0) * 10,
  });

  // Create the embed
  const leaderboardEmbed = new EmbedBuilder()
    .setTitle(":trophy: Unrecord Leveling Leaderboard")
    .setColor(0xb10dc9);

  // Page does not exist
  if (rankings.length === 0)
    return errorEmbed(message, "Page number out of bounds.");

  // This function attempts to fetch all the users in pararrel.
  (
    await Promise.all(
      rankings.map((item, index) => embedEntry(item, index + 1, page)),
    )
  )
    // Add fields onto the embed
    .map((field) => leaderboardEmbed.addFields(field));

  // Typescript, my beloved. Of course it's sendable...
  if (!message.channel.isSendable()) return;

  // Measure the time it took to execute this function.
  const timeElapsed = new Date().getTime() - t1;

  // Set a footer to let the user know if the bot fetched cached entries or not.
  leaderboardEmbed.setFooter({
    text: `Cache: ${timeElapsed > 30 ? "MISS" : "HIT"}. Took ${timeElapsed}ms.`,
  });

  // Send the embed
  message.channel.send({ embeds: [leaderboardEmbed] });
};
