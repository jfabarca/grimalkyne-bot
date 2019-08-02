const Command = require('../command');

module.exports = new Command(
  {
    triggers: ['say']
  },
  async ({ msg, args }) => {
    return args.join(' ');
  }
);
