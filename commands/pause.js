const {SlashCommandBuilder} = require("@discordjs/builders");
const { pause, isPaused } = require('../player.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pause current video"),
    async execute(interaction) {
        if (isPaused()) {
            pause();
            await interaction.reply('Stopped playing the video')
        } else {
            await interaction.reply('No video to pause')
        }
    }
}