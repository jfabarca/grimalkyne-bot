const Eris        = require('eris');
const logger      = require('./logger');
const handler     = require('./handler');
const config      = require('./config');
const commands    = require('./commands');
const i18n_module = require('i18n-nodejs');
const join        = require('path').join;

class App {
  constructor() {
    this.i18n = {};
    this.config = config;
    this.logger = logger({ env: config.env, level: config.logger.level });
    this.commands = commands();
    this.bot = new Eris.Client(config.discord.token);

    for(let i = 0; i < config.bot.locales.length; i++) {
      let locale = config.bot.locales[i];
      this.i18n[locale] = new i18n_module(locale, join(__dirname, './i18n/locale.json'));
    }

    this.bot.on('ready', () => this.logger.info('Bot is ready'));
    this.bot.on('messageCreate', handler.bind(this));
    this.bot.on('warn',  warn => this.logger.warn('Eris warn: %s', warn));
    this.bot.on('error', error => this.logger.warn('Eris error: %s', warn));
    this.bot.on('disconnect', () => this.logger.warn('Bot disconnected'));
  }

  async start() {
    try {
      await this.bot.connect();
    } catch(error) {
      this.logger.error('Connection failed: %s', error.message);
    }
  }

  stop() {
    this.bot.disconnect({ reconnect: false });
    this.logger.info('Bot manually disconnected');
  }
}

module.exports = new App();
