const { Client } = require('eris');
const moment = require('moment');
const logger = require('./utils/logger');
const config = require('./config');
const handler = require('./handler');
const commands = require('./commands');
const { LocaleManager } = require('./i18n');

class App {
  constructor() {
    this.commands = commands;
    this.config = config;
    this.i18n = new LocaleManager(config.locales);
    this.eris = new Client(config.discord.token);

    this.eris.on('warn', warn => logger.warn('Eris warn: %s', warn));
    this.eris.on('error', error => logger.warn('Eris error: %s', error));
    this.eris.on('disconnect', () => logger.info('Bot disconnected'));
    this.eris.on('messageCreate', handler.bind(this));
    this.eris.on('ready', () =>
      logger.info(
        [
          `\n ========== Bot started at ${moment
            .utc(this.eris.startTime)
            .format('HH:mm:ss')} ==========`,
          ` | Logged in as: ${this.eris.user.username}.`,
          ` | Bot current stats:`,
          ` |  - ${this.eris.guilds.size} servers. ${
            this.eris.users.filter(u => !u.bot).length
          } users.`,
          ` =============================================`
        ].join('\n')
      )
    );
  }

  async start() {
    await this.eris.connect();
  }

  stop() {
    this.eris.disconnect({ reconnect: false });
    logger.info('Bot manually disconnected');
  }
}

module.exports = new App();
