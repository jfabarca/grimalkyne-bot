const { Command } = require('../../model');
const monsters = require('./monsters.json');

module.exports = new Command({
  triggers: ['monster','m'],
  argsRequired: true
}, async ({ msg, args, i18n }) => {

  let param = args[0].toLowerCase();
  let monster = monsters[param];

  if(!monster) {
    return i18n.__('monsters.not_found', { arg: args[0] });
  }

  return {
    embed: {
      author: {
        name: monster.name
      },
      thumbnail: {
        url: monster.image
      },
      fields: [
        {
          name: 'Size',
          value: i18n.__(monster.size)
        },
        {
          name: 'Type',
          value: i18n.__(monster.type)
        },
        {
          name: 'Locations',
          value: monster.locations.map(x => i18n.__(x)).join(', ')
        },
        {
          name: 'Weaknesses',
          value: monster.weaknesses.map(x => ``).join(', ')
        }
      ]
    }
  };
});
