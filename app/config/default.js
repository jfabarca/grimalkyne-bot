const version = require('../../package.json').version;

module.exports = {
  env: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  version,
  port: process.env.PORT || 8080,
  logger: {
    level: process.env.LOGGER_LEVEL || 'info'
  },
  discord: {
    token: process.env.DISCORD_TOKEN
  },
  locales: ['es', 'en'],
  bot: {
    prefix: process.env.PREFIX || ',',
    owner: {
      id: '308715245059309569',
      username: 'Koi',
      discriminator: '#5558'
    }
  }
};
