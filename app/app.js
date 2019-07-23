const { Client } = require('eris');
const { logger } = require('./utils');
const moment = require('moment');
const config = require('./config');
const handler = require('./handler');
const commands = require('./commands');
const i18n_module = require('i18n-nodejs');
const join = require('path').join;

class App {
  constructor() {
    this.config = config;
    this.eris = new Client(config.discord.token);

    this.eris.on('warn', warn => logger.warn('Eris warn: %s', warn));
    this.eris.on('error', error => logger.warn('Eris error: %s', error));
    this.eris.on('disconnect', () => logger.warn('Bot disconnected'));
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

    // this.i18n = {};
    // this.config = config;
    // this.logger = logger({ env: config.env, level: config.logger.level });
    // this.commands = commands();
    // this.bot = new Eris.Client(config.discord.token);
    //
    // for (let i = 0; i < config.bot.locales.length; i++) {
    //   let locale = config.bot.locales[i];
    //   this.i18n[locale] = new i18n_module(
    //     locale,
    //     join(__dirname, './i18n/locale.json')
    //   );
    // }
    //
    // this.bot.on('ready', () => this.logger.info('Bot is ready'));
    // this.bot.on('messageCreate', handler.bind(this));
    // this.bot.on('warn', warn => this.logger.warn('Eris warn: %s', warn));
    // this.bot.on('error', error => this.logger.warn('Eris error: %s', warn));
    // this.bot.on('disconnect', () => this.logger.warn('Bot disconnected'));
  }

  async start() {
    try {
      await this.eris.connect();
    } catch (error) {
      logger.error('Connection failed: %s', error.message);
    }
  }

  stop() {
    this.eris.disconnect({ reconnect: false });
    logger.info('Bot manually disconnected');
  }
}

module.exports = new App();
