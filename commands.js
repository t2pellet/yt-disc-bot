const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, token } = require('./config.json');
const fs = require("fs");
const rest = new REST({ version: '9' }).setToken(token);

const commands = new Map();
const commandData = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const commandFile of commandFiles) {
    const command = require(`./commands/${commandFile}`);
    commands.set(command.data.name, command);
    commandData.push(command.data.toJSON());
}

rest.put(Routes.applicationCommands(clientId), {body: commandData})
    .then(() => console.log('Successfully registered commands.'))
    .catch(console.error)

module.exports = commands;