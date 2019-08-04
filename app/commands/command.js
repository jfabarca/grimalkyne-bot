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

    const message = this.validate(params);
    if (message) {
      return message;
    }

    return this.fn(params);
  }

  validate({ app, msg, args, i18n, prefix }) {
    if (this.settings.guildOnly && !msg.channel.guild) {
      return i18n.translate('command.guild_required');
    } else if (
      this.settings.adminOnly &&
      !msg.member.permission.has('administrator')
    ) {
      return i18n.translate('command.admin_only');
    } else if (this.settings.isNSFW && !msg.channel.nsfw) {
      return i18n.translate('command.nsfw_required');
    } else if (this.settings.argsRequired && args.length === 0) {
      return i18n.translate('command.args_required', {
        prefix,
        command: this.settings.triggers[0]
      });
    }
    // Validate bot permissions for this channel
    if (!msg.channel.guild) {
      return;
    }
    const channelPermissions = msg.channel.permissionsOf(app.eris.user.id);

    const requiredPermissions = this.settings.permissions.filter(
      permission => !channelPermissions.has(permission)
    );
    console.log(requiredPermissions);
    if (requiredPermissions.length && channelPermissions.has('sendMessages')) {
      return i18n.translate('permissions_required', {
        permissions: requiredPermissions.map(p => '`' + p + '`').join(', '),
        bot: app.eris.user.username
      });
    }
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
