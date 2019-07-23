require('dotenv').config();

const { logger } = require('./utils');

const app = require('./app');

process.on('unhandledRejection', error => {
  logger.warn('UnhandledPromiseRejectionWarning: %s', error.stack || error);
});

// https://stackoverflow.com/questions/10021373/what-is-the-windows-equivalent-of-process-onsigint-in-node-js
if (process.platform === 'win32') {
  let rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.on('SIGINT', function() {
    process.emit('SIGINT');
  });
}

app
  .start()
  .then(() => {
    process.on('SIGINT', () => {
      app.stop();
      process.exit(0);
    });
  })
  .catch(error => {
    logger.error(error.stack);
    process.exit(1);
  });
