const { join } = require('path');
const i18n_module = require('i18n-nodejs');

class Locale {
  constructor(locale) {
    this.locale = locale;
    this.i18n = new i18n_module(locale, join(__dirname, './locale.json'));
  }

  translate(prop, args) {
    return this.i18n.__(prop, args);
  }
}

module.exports = Locale;
