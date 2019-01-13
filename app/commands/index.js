const { join } = require('path');
const { readdirSync } = require('fs');

const commands = {
  aliases: {}
};

module.exports = () => {
  let categories = readdirSync(join(__dirname, './')).filter(c => !c.includes('.'));

  categories.forEach(category => {
    let files = readdirSync(join(__dirname, category)).filter(f => f.includes('.'));
    files.forEach(file => {
      let command = require(join(__dirname, category, file));
      command.category = category;
      let trigger = command.settings.triggers[0];
      let aliases = command.settings.triggers.slice(1);
      if(!commands[trigger]) {
        commands[trigger] = command;
      }
      aliases.forEach(alias => {
        if(!commands.aliases[alias]) {
          commands.aliases[alias] = command;
        }
      });
    });
  });

  return commands;
};
