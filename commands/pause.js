const {SlashCommandBuilder} = require("@discordjs/builders");
const { pause, isPaused } = require('../player.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pause current video"),
    async execute(interaction) {
        if (!isPaused()) {
            pause();
            await interaction.editReply('Paused the video')
        } else {
            await interaction.editReply('No video to pause')
        }
    }
}