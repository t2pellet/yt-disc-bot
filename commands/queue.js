const {SlashCommandBuilder} = require("@discordjs/builders");
const { getQueue, current } = require('../player.js')
const {MessageEmbed} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Show current queue"),
    async execute(interaction) {
        let currSong = current();
        let queue = getQueue();

        if (currSong == null) {
            await interaction.editReply("There is nothing playing")
            return;
        }

        let embeds = [];
        embeds.push(
            new MessageEmbed()
            .setTitle("Currently Playing")
            .setDescription(`**${currSong.title}**\n${currSong.ownerChannelName}`));

        if (queue.length != 0) {
            let description = '';
            queue.forEach(result => {
                description += `**${result.title}**\n\t${result.ownerChannelName}\n\n`;
            })
            embeds.push(
                new MessageEmbed()
                    .setTitle("Current Queue")
                    .setDescription(description));
        }

        await interaction.editReply({embeds: embeds})
    }
}