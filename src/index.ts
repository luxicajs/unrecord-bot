import { Client, Events, GatewayIntentBits } from "discord.js";
import messageHandler from "./modules/messageCreate";
import { PrismaClient } from "../prisma/sdk";
import interactionCreate from "./modules/interactionCreate";
import joinHandler from "./modules/joinHandler";
// import "./utils/registerEvents";

// Initialize DB client.
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
    console.log(`Logged in as ${client.user.tag}. Took ${performance.now()}ms`);
})
    .on(Events.GuildMemberAdd, joinHandler)
    .on(Events.MessageCreate, messageHandler)
    .on(Events.InteractionCreate, interactionCreate)
    .login(Bun.env.BOT_TOKEN);

