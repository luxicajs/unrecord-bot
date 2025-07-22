import { ButtonBuilder, ButtonStyle, ContainerBuilder, EmbedBuilder, MediaGalleryBuilder, MediaGalleryItem, MediaGalleryItemBuilder, MessageFlags, SectionBuilder, TextDisplayBuilder, ThumbnailBuilder, type Message } from "discord.js";
import { prisma } from "..";
import errorEmbed from "../utils/errorEmbed";

// I'm going to use the old system in place until I can find a better way to do this

const boosterRole = "1089241269429080235";

export default async (message: Message, args: string[]) => {
    const user = await prisma.user.findUnique({
        where: {
            id: message.author.id
        }
    });

    if (!user || user.level < 15 && !message.member?.roles.cache.has(boosterRole)) return errorEmbed(message, "You need Level 15 or above to be able to use this command. Alternatively, you can boost the server.");

    if (!args[0]) {
        const cardEmbed = new EmbedBuilder()
            .setTitle("> :question: Choose your rank card")
            .setDescription(`Use the .card [preset] command to customize your rank card.\nExample \`.card 1\``)
            // honestly this is a bad idea but i'll put a better system in place later. promise.
            .setImage("https://cdn.discordapp.com/attachments/1088839882144747551/1204885601061441626/embed-showcase.png?ex=6843f768&is=6842a5e8&hm=0adb054d791b24f9a8433ea18824049de82fef8074cec5f07c033c85d6347acb&")
            .setColor(0xB10DC9);

        return message.reply({ embeds: [cardEmbed] })
    }

    if (!Number.isInteger(parseInt(args[0]))) return errorEmbed(message, "Invalid option. Choose between preset 1-6");

    const option = Number(args[0]);

    if (option < 0 || option > 6) return errorEmbed(message, "Invalid option. Choose between preset 1-6");

    await prisma.user.update({
        where: user,
        data: {
            card: option
        }
    });

    message.reply(":white_check_mark: Success. Your rank card has been updated.");
}