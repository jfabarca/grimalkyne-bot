const { CommandValidationError } = require('../utils/errors');

class Command {
  constructor(settings, fn) {
    this.fn = fn;
    this.subCommands = {};

    const defaults = {
      cooldown: 2000,
      isNSFW: false,
      ownerOnly: false,
      guildOnly: false,
      adminOnly: false,
      argsRequired: false,
      upvoteOnly: false,
      donorOnly: false,
      permissions: []
    };

    this.settings = { ...defaults, ...settings };
    this.settings.permissions = defaults.permissions.concat(
      settings.permissions || []
    );
  }

  async run(params) {
    const subCommand = params.args[0];
    if (subCommand && this.subCommands[subCommand]) {
      params.args.shift();
      params.cleanArgs.shift();
      return this.subCommands[subCommand].run(params);
    }

    this.isValid(params);

    return this.fn(params);
  }

  isValid({ msg, args, i18n, prefix }) {
    if (this.settings.guildOnly && !msg.channel.guild) {
      // return i18n.__('command.guild_required');
      throw new CommandValidationError('This command is for guilds only!');
    } else if (
      this.settings.adminOnly &&
      !msg.member.permission.has('administrator')
    ) {
      // return i18n.__('command.admin_only');
      throw new CommandValidationError('Admin only!');
    } else if (this.settings.isNSFW && !msg.channel.nsfw) {
      // return i18n.__('command.nsfw_required');
      throw new CommandValidationError('NSFW only!');
    } else if (this.settings.argsRequired && args.length === 0) {
      // return i18n.__('command.args_required', { prefix, command: this.settings.triggers[0] });
      throw new CommandValidationError(`Args required!`);
    }
    // Validate command permissions for guild
    // let permissions = msg.channel.guild && msg.channel.permissionsOf(bot.user.id);
    //
    // if(permissions) {
    //   let requiredPermissions = [];
    //   properties.permissions.forEach(p => !permissions.has(p) && requiredPermissions.push(p));
    //
    //   if(requiredPermissions.length > 0) {
    //     if(permissions.has('sendMessages')) {
    //       return i18n.__('permissions_required', {
    //         operator: msg.author.mention,
    //         permissions: requiredPermissions.map(p => '`'+p+'`').join(', '),
    //         bot_username: bot.user.username
    //       });
    //     }
    //   }
    // }
    // return false;
  }

  registerSubCommand(trigger, fn, srcSettings = {}) {
    if (this.subCommands[trigger]) {
      return;
    }

    const settings = { ...this.settings, ...srcSettings };
    settings.permissions = this.settings.permissions.concat(
      srcSettings.permissions || []
    );

    this.subCommands[trigger] = new Command(settings, fn);

    return this.subCommands[trigger];
  }

  unregisterSubCommand(trigger) {
    delete this.subCommands[trigger];
  }
}

module.exports = Command;
