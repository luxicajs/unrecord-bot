import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder, FileBuilder, MessageFlags, ModalBuilder, SectionBuilder, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder, TextInputBuilder, TextInputStyle, ThumbnailBuilder, type Interaction } from "discord.js";
import { bot } from "..";
import { tryCatch } from "../utils/tryCatch";

export default async (interaction: Interaction) => {

    if (interaction.isMessageContextMenuCommand()) {
        const msg = interaction.targetMessage;

        const modal = new ModalBuilder()
            .setCustomId(`reportModal-${msg.id}`)
            .setTitle(`Report ${msg.author.username}'s message`);

        const contextField = new TextInputBuilder()
            .setCustomId("context")
            .setLabel(`Report reason`)
            .setMaxLength(1024)
            .setRequired(false)
            .setStyle(TextInputStyle.Paragraph);

        // @ts-ignore fuck off
        modal.addComponents(new ActionRowBuilder().addComponents(contextField));

        return await interaction.showModal(modal);
    }

    if (interaction.isModalSubmit() && interaction.customId.startsWith("reportModal-")) {
        const msgId = interaction.customId.replace("reportModal-", "");

        if (!interaction.channel) return console.error(`Fatal error. Channel not found in cache.`);

        const msg = await tryCatch(interaction.channel.messages.fetch(msgId));

        if (msg.error || !msg.data) return console.error(`Fatal error. Channel not found in cache.`);

        const container = new ContainerBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`### ❗ New report inbound`)
            )
            .addSeparatorComponents(
                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
            )
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(`> :people_hugging:  Author:
${interaction.user.username} (<@${interaction.user.id}>)
> :calendar_spiral:  Date:
 <t:${Math.round(new Date().getTime() / 1000)}:R>
> :customs:  Infringing user:
${msg.data.author.username} (<@${msg.data.author.id}>)
> :arrow_down_small:  Report context:
${interaction.fields.getTextInputValue("context") || "No context included"}`))
            .addSeparatorComponents(
                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
            )
            .addSectionComponents(
                new SectionBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(`> :cinema:  Recorded message content:\n${msg.data.content || "No content"}`)
                    )
                    .setButtonAccessory(
                        new ButtonBuilder()
                            .setURL(`https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${msg.data.id}`)
                            .setStyle(ButtonStyle.Link)
                            .setLabel("Jump to message")
                    )
            )
            .setAccentColor(0xB10DC9);

        if (msg.data.attachments) {
            container.addSeparatorComponents(
                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
            )
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent("> :hash: Recorded Attachments")
                ).addSectionComponents(
                    Array.from(msg.data.attachments.values()).map((attachment, index) =>
                        new SectionBuilder().addTextDisplayComponents(
                            new TextDisplayBuilder()
                                .setContent(`> ${index + 1}. ${attachment.name}`))
                            .setButtonAccessory(new ButtonBuilder().setLabel(`View`)
                                .setURL(attachment.proxyURL)
                                .setStyle(ButtonStyle.Link))
                    ));
        }

        const channel = bot.channels.cache.get(Bun.env.REPORT_CHANNEL);

        if (!channel || !channel.isSendable()) return console.error(`Fatal error. Channel not found in cache.`);

        await channel.send({ components: [container], flags: [MessageFlags.IsComponentsV2] });

        const successContainer = new ContainerBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent("### :white_check_mark: Your report has been sent.\nYour report has been sent to staff and we'll take action as soon as possible."))
            .addSeparatorComponents(
                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
            ).addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(`-# By submitting this report you understand that you are doing this with good faith in accordance with the server rules, and any abuse of this system will result in a permanent removal from this server. Staff members reserve the right to decide if they take action against the user or spare them.`))
            .setAccentColor(0xB10DC9);


        return await interaction.reply({ flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2], components: [successContainer] })
    }

}