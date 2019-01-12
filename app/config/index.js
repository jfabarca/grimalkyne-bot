const fs        = require('fs');
const path      = require('path');
const defaults  = require('./default');

let envConfigFile = path.normalize(`${__dirname}/${process.env.NODE_ENV || 'development'}.js`);

let envConfig = fs.existsSync(envConfigFile) && require(envConfigFile);

module.exports = envConfig ? { ...defaults, ...envConfig } : defaults;
