import { Client, Events, GatewayIntentBits } from "discord.js";
import messageHandler from "./modules/messageCreate";
import { PrismaClient } from "../prisma/sdk";

export const prisma = new PrismaClient();

export const bot = new Client({
    intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
    ],
});

bot.on(Events.ClientReady, (client) => {
    console.log(`Logged in as ${client.user.tag}. Took ${performance.now()}`);
})
    .on(Events.MessageCreate, messageHandler)
    .login(Bun.env.BOT_TOKEN);

