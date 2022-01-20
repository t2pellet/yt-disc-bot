const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { join, play, resume, isPaused, isPlaying } = require('../player.js')
const { getInfo } = require('ytdl-core')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play video!")
        .addStringOption(option => {
            return option.setName("url")
                .setDescription("The URL of the video to play")
        }),
    async execute(interaction) {
        let url = await interaction.options.getString('url');
        if (interaction.member.voice.channel == null) {
            await interaction.reply("You gotta be in a voice channel bruh");
            return;
        }
        // Join channel
        await join(interaction.member.voice.channel.id, interaction.member.guild.id, interaction.guild.voiceAdapterCreator);
        // Play video
        if (url == null) {
            if (isPaused()) {
                await resume();
                await interaction.reply("Resumed playback")
            } else {
                await interaction.reply("Nothing playing to resume")
            }
        } else {
            await play(url);
            let title = isPaused() || isPlaying() ? "Queued Video" : "Playing Video";
            let desc = (await getInfo(url, {downloadURL: true})).videoDetails.title;
            const embed = new MessageEmbed()
                .setTitle(title)
                .setDescription(desc)
                .setURL(url);
            await interaction.reply({ embeds: [embed] });
        }
    },
};