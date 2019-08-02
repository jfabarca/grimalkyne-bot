const { join } = require('path');
const { readdirSync } = require('fs');

module.exports = (dirname, category) => {
  const commands = [];

  readdirSync(dirname)
    .filter(c => c !== 'index.js')
    .forEach(c => {
      const command = require(join(dirname, c));
      command.category = category;
      if (Array.isArray(command)) {
        Array.prototype.push.apply(commands, command);
      } else {
        commands.push(command);
      }
    });

  return {
    name: category,
    commands
  };
};
