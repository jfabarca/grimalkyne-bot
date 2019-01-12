require('dotenv').config();

const app = require('./app');

process.on('unhandledRejection', error => {
  app.logger.warn('UnhandledPromiseRejectionWarning: %s', error.stack);
});

// https://stackoverflow.com/questions/10021373/what-is-the-windows-equivalent-of-process-onsigint-in-node-js
if (process.platform === "win32") {
  var rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.on("SIGINT", function () {
    process.emit("SIGINT");
  });
}

app.start()
.then(() => {
  process.on('SIGINT', () => {
    app.stop();
    process.exit(0);
  });
}).catch(error => {
  app.logger.error(error.stack);
  process.exit(1);
});
