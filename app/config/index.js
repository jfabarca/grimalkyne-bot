const fs = require('fs');
const path = require('path');
const defaults = require('./default');

const envFile = path.join(__dirname, process.env.NODE_ENV);

module.exports = fs.existsSync(envFile)
  ? { ...defaults, ...require(envFile) }
  : defaults;
