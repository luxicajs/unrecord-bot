import { ApplicationCommandType, ContextMenuCommandBuilder, REST, Routes } from "discord.js";

const rest = new REST().setToken(Bun.env.BOT_TOKEN);

await rest.put(
    Routes.applicationGuildCommands(Bun.env.CLIENT_ID, Bun.env.GUILD_ID),
    {
        body: [new ContextMenuCommandBuilder().setName("Report Message").setType(ApplicationCommandType.Message).toJSON()]
    }
);