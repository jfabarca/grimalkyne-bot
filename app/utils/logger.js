const winston = require('winston');
const config = require('../config');
const { format, transports } = winston;

const logger = winston.createLogger({
  exitOnError: false,
  level: config.logger.level.toLowerCase(),
  format: format.combine(
    format.splat(),
    format.timestamp(),
    format.label({ label: config.env.toLowerCase() })
  ),
  transports: [
    new transports.Console({
      handleExceptions: true,
      format: format.combine(
        format.colorize(),
        format.printf(
          json =>
            `${json.timestamp} [${json.label}] ${json.level}: ${
              typeof json.message === 'object'
                ? JSON.stringify(json.message, null, 2)
                : json.message
            }`
        )
      )
    })
  ]
});

// logger.stream = {
//   write: message =>
//     message.endsWith('\n')
//       ? logger.info(message.substring(0, message.length - 1))
//       : logger.info(message)
// };

module.exports = logger;
