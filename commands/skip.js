const {SlashCommandBuilder} = require("@discordjs/builders");
const { skip } = require('../player.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip the current video"),
    async execute(interaction) {
        skip();
        await interaction.reply(`Skipped the current video`)
    }
}