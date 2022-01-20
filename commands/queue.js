const {SlashCommandBuilder} = require("@discordjs/builders");
const { listAll } = require('../player.js')
const {MessageEmbed} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Show current queue"),
    async execute(interaction) {
        let results = listAll();

        let description = '';
        results.forEach(result => {
            description += result.title + '\n';
        })

        let embed = new MessageEmbed()
            .setTitle("Current Queue")
            .setDescription(description);
        await interaction.reply({embeds: [embed]})
    }
}