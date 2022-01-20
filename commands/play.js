const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { join, play, resume, isPaused, isPlaying } = require('../player.js')
const { getInfo } = require('ytdl-core')
const { search } = require('youtube-search-without-api-key')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play video!")
        .addStringOption(option => {
            return option.setName("url")
                .setDescription("The URL of the video to play")
        })
        .addStringOption(option => {
            return option.setName("name")
                .setDescription("The name of the video to play")
        }),
    async execute(interaction) {
        let url = await interaction.options.getString('url');
        let name = await interaction.options.getString('name');
        if (interaction.member.voice.channel == null) {
            await interaction.reply("You gotta be in a voice channel bruh");
            return;
        }
        // Join channel
        await join(interaction.member.voice.channel.id, interaction.member.guild.id, interaction.guild.voiceAdapterCreator);
        // Play video
        if (name != null) {
            let results = await search(name);
            url = results[0].snippet.url;
        }
        if (url != null) {
            await play(url);
            let title = isPaused() || isPlaying() ? "Queued Video" : "Playing Video";
            let desc = (await getInfo(url, {downloadURL: true})).videoDetails.title;
            const embed = new MessageEmbed()
                .setTitle(title)
                .setDescription(desc)
                .setURL(url);
            await interaction.reply({ embeds: [embed] });
        } else {
            if (isPaused()) {
                await resume();
                await interaction.reply("Resumed playback")
            } else {
                await interaction.reply("Nothing playing to resume")
            }
        }
    },
};