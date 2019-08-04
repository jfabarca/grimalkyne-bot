const Command = require('../command');

module.exports = new Command(
  {
    triggers: ['say'],
    permissions: ['manageMessages'],
    guildOnly: true,
    argsRequired: true
  },
  async ({ msg, args }) => {
    await msg.delete();
    return args.join(' ');
  }
);
