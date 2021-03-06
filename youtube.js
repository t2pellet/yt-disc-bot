// Requires
const {Client, Intents} = require('discord.js')
const {token} = require("./config.json")
const commands = require("./commands.js")

// Setup client
const client = new Client({intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ]});


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = commands.get(interaction.commandName);
    if (!command) return;

    try {
        await interaction.deferReply();
        await command.execute(interaction)
    } catch (error) {
        console.error(error);
        await interaction.editReply("There was an error executing this command");
    }
})

client.login(token);