const { join } = require('path');
const { readdirSync } = require('fs');
const logger = require('../utils/logger');

const commands = {
  aliases: {}
};
const categories = readdirSync(__dirname).filter(f => !f.includes('.'));

categories.forEach(dir => {
  const category = require(join(__dirname, dir));
  category.commands.forEach(cmd => {
    const trigger = cmd.settings.triggers[0];
    const aliases = cmd.settings.triggers.slice(1);

    if (commands[trigger]) {
      logger.error(`Command '${trigger}' is already registered!`);
      process.exit(1);
    }
    commands[trigger] = cmd;

    aliases.forEach(alias => {
      if (commands.aliases[alias]) {
        logger.error(`Command with alias '${alias}' is already registered!`);
        process.exit(1);
      }
      commands.aliases[alias] = cmd;
    });
  });
});

module.exports = commands;
