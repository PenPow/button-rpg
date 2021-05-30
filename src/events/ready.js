const AsciiTable = require('ascii-table');

module.exports = async (client) => { 
    client.logger.info("Loading Slash Commands...");
    let table = new AsciiTable('Slash Commands');
    table.setHeading('Command Name', 'Type', 'Status');

    const commandArray = [];

    client.commands.forEach(async command => {
        if(command.disabled) return table.addRow(command.name, client.utils.capitalize(command.type), "Fail");
        if(command.ownerOnly || command.type === client.types.OWNER) return table.addRow(command.name, client.utils.capitalize(command.type), "Fail");
        
        const data = {
            name: command.name.toLowerCase(),
            description: command.description,
        };

        let options = [];

        if(command.arguments) {

            for(let i = 0; i < command.arguments.length; i++) {
                options.push({
                    name: command.arguments[i].name.toLowerCase(),
                    type: command.arguments[i].type.toUpperCase(),
                    description: command.arguments[i].description,
                    required: Boolean(command.arguments[i].required)
                })
            }

        }

        if(options) data.options = options;

        commandArray.push(data);

        table.addRow(command.name, client.utils.capitalize(command.type), "Pass");
    });

    const guild = await client.guilds.fetch('789215359878168586');
    guild.commands.set(commandArray);
    client.logger.log(table.toString());

    client.logger.success('RPG Bot is now online');
    client.logger.info(`RPG Bot is running on ${client.guilds.cache.size} servers`);
}