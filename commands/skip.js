const {SlashCommandBuilder} = require("@discordjs/builders");
const { skip, isEmpty } = require('../player.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip the current video"),
    async execute(interaction) {
        if (isEmpty()) {
            await interaction.reply('Nothing to skip')
        } else {
            skip();
            await interaction.reply(`Skipped the current video`)
        }
    }
}