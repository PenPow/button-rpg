const Discord = require('discord.js');
const { readdir, readdirSync } = require('fs');
const { join, resolve } = require('path');
const Enmap = require("enmap");

const Command = require("./commands/Command.js");

const AsciiTable = require('ascii-table');

class Client extends Discord.Client {

    constructor(config, options = {}) {
        super(options);

        this.logger = require("consola");
        
        this.db = new Enmap({
            name: "database",
            persistent: true,
            fetchAll: true,
            autoFetch: true,
        });

        this.types = {
            INFO: 'info',
            FUN: 'fun',
            MISC: 'misc',
            MOD: 'mod',
            ADMIN: 'admin',
            OWNER: 'owner'
        };

        this.commands = new Discord.Collection();

        this.aliases = new Discord.Collection();

        this.queue = new Discord.Collection();

        this.token = config.apiKeys.discord.token;

        this.apiKeys = config.apiKeys;
        
        this.config = require("../config.json");

        this.ownerId = config.configuration.ownerId;

        this.utils = require("./utils/utils.js");

        this.logger.info('Initalizing...');
    };

    loadEvents(path) {
        readdir(path, (err, files) => {
            if(err) this.logger.error(err);
            files = files.filter(f => f.split('.').pop() === 'js');
            if(files.length === 0) return this.logger.warn('No Events Found');
            this.logger.info(`Found ${files.length} event(s)...`);
            files.forEach(f => {
                const eventName = f.substring(0, f.indexOf('.'));
                const event = require(resolve(__basedir, join(path, f)));
                super.on(eventName, event.bind(null, this));
                delete require.cache[require.resolve(resolve(__basedir, join(path, f)))];
                // this.logger.success(`Loading Event: ${this.utils.capitalize(eventName)}`);
            });
        });

        return this;
    };

    loadCommands(path) {
        this.logger.info("Loading Commands...");
        let table = new AsciiTable('Commands');
        table.setHeading('File', 'Aliases', 'Type', 'Status');
        readdirSync(path).filter(f => !f.endsWith('.js')).forEach(dir => {
            const commands = readdirSync(resolve(__basedir, join(path, dir))).filter(f => f.endsWith('js'));
            commands.forEach(f => {
                const Command = require(resolve(__basedir, join(path, dir, f)));
                const command = new Command(this);
                if(command.name && !command.disabled) {
                    this.commands.set(command.name, command);

                    let aliases = '';
                    if(command.aliases) {
                        command.aliases.forEach(alias => {
                            this.aliases.set(alias, command);
                        });

                        aliases = command.aliases.join(', ');
                    };

                    // this.logger.success(`Loading Commmand: ${this.utils.capitalize(command.name)}`);

                    table.addRow(f, aliases, this.utils.capitalize(command.type), 'Pass');

                } else {
                    // this.logger.warn(`Failed to load ${f}`);

                    table.addRow(f, '', '', 'Fail');
                    return;
                };
            });
        });

        this.logger.info(`Command Load Status\n${table.toString()}`);
        return this;
    };

    isOwner(user) {
        if(user.id === this.ownerId) return true;
        else return false;
    };

    checkVoiceChannel(botVoiceChannel, userVoiceChannel) {
        if(botVoiceChannel.id !== userVoiceChannel.id) return false;
        return true;
    };
};

module.exports = Client;