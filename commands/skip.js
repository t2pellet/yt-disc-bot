const {SlashCommandBuilder} = require("@discordjs/builders");
const { skip, isEmpty, isPlaying, isPaused } = require('../player.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip the current video"),
    async execute(interaction) {
        if (isEmpty() && !isPlaying() && !isPaused()) {
            await interaction.editReply('Nothing to skip')
        } else {
            skip();
            await interaction.editReply(`Skipped the current video`)
        }
    }
}