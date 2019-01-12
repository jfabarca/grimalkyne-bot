const Eris   = require('eris');
const logger = require('./logger');
const config = require('./config');

class App {
  constructor() {
    this.logger = logger({ env: config.env, level: config.logger.level });
    this.bot = Eris.Client(config.discord.token);

    this.bot.on('ready', () => this.logger.info('Bot is ready'));
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
