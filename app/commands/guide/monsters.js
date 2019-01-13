const { Command } = require('../../model');

module.exports = new Command({
  triggers: ['monster','m']
}, async ({ msg, args, i18n }) => {
  return 'Monsters command!';
});
