const config = require('./config.json');
const Client = require('./src/Client.js');
const { Intents } = require('discord.js');

global.__basedir = __dirname;

const intents = new Intents();
intents.add(
    'GUILDS',
    'GUILD_MESSAGES',
    'GUILD_MESSAGE_REACTIONS',
    'DIRECT_MESSAGES',
    'DIRECT_MESSAGE_REACTIONS',
    'GUILD_BANS',
    'GUILD_VOICE_STATES',
    'GUILD_PRESENCES',
    'GUILD_MEMBERS',
);

const client = new Client(config, { 
    intents: intents,
    allowedMentions: { parse: ['users', 'everyone', 'roles'], repliedUser: false },
    partials: ['USER', 'CHANNEL', 'MESSAGE']
});

function init() {
    client.loadEvents('./src/events');
    client.loadCommands('./src/commands');
    client.login(client.token);
};

init();

process.on('unhandledRejection', err => client.logger.error(err));