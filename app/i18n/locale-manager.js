const Locale = require('./locale.js');

class LocaleManager {
  constructor(locales) {
    this.i18n = {};
    this.locales = locales;
    this.defaultLocale = locales[0];
    this.locales.forEach(locale => (this.i18n[locale] = new Locale(locale)));
  }

  getLocale(locale) {
    return this.i18n[locale]
      ? this.i18n[locale]
      : this.i18n[this.defaultLocale];
  }
}

module.exports = LocaleManager;

// for (let i = 0; i < config.bot.locales.length; i++) {
//   let locale = config.bot.locales[i];
//   this.i18n[locale] = new i18n_module(
//     locale,
//     join(__dirname, './i18n/locale.json')
//   );
// }
