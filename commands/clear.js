const {SlashCommandBuilder} = require("@discordjs/builders");
const { clear } = require('../player.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Clear all videos"),
    async execute(interaction) {
        clear();
        await interaction.editReply(`Cleared videos`)
    }
}