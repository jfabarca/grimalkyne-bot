const version   = require('../../package.json').version;

module.exports = {
  env: process.env.NODE_ENV || 'development',
  version,
  port: process.env.PORT || 8080,
  logger: {
    level: process.env.LOGGER_LEVEL || 'info'
  },
  discord: {
    token: process.env.DISCORD_TOKEN
  },
  bot: {
    prefix: process.env.PREFIX || '/',
    default_locale: 'en',
    owner: {
      id: '308715245059309569',
      username: 'Koi',
      discriminator: '#5558'
    }
  }
}
