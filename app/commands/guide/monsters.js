const Command = require('../command');
const monsters = require('../../data/monsters.json');

module.exports = new Command(
  {
    triggers: ['monster', 'm'],
    argsRequired: true
  },
  async ({ msg, args, i18n }) => {
    let param = args[0].toLowerCase();
    let monster = monsters[param];

    if (!monster) {
      return i18n.__('monsters.not_found', { arg: args[0] });
    }

    const weaknesses = [];
    for (let i = 0; i < monster.weaknesses.length; i += 2) {
      let w1 = monster.weaknesses[i];
      let w2 = monster.weaknesses[i + 1];
      weaknesses.push(
        `${i18n.__(w1.element)} ` +
          '★'.repeat(w1.quantity).padEnd(3, '☆') +
          ` ${i18n.__(w2.element)} ` +
          '★'.repeat(w2.quantity).padEnd(3, '☆')
      );
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
            value: i18n.__(monster.size),
            inline: true
          },
          {
            name: 'Type',
            value: i18n.__(monster.type),
            inline: true
          },
          {
            name: 'Locations',
            value: monster.locations.map(x => i18n.__(x)).join(', ')
          },
          {
            name: 'Weaknesses',
            value: weaknesses.join('\n'),
            inline: true
          },
          {
            name: 'Ailments',
            value: monster.ailments.map(x => i18n.__(x)).join('\n'),
            inline: true
          }
        ]
      }
    };
  }
);
