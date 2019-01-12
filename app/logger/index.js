const winston = require('winston');
const { format, transports } = winston;
const { combine, label, timestamp, splat, colorize, printf } = format;

module.exports = (options) => {
  options       = options || {};
  options.level = options.level || 'silly';
  options.env   = options.env || 'development';

  let logger = winston.createLogger({
    exitOnError: false,
    level: options.level,
    format: combine(
      label({ label: options.env }),
      timestamp(),
      splat(),
      colorize(),
      printf(info => `${info.timestamp} [${info.label}] ${info.level}: ${(typeof info.message === 'object') ? JSON.stringify(info.message, null, 2) : info.message}`)
    ),
    transports: [
      new transports.Console({
        handleExceptions: true
      })
    ]
  });

  return logger;
};
