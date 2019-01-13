module.exports = async function(msg) {
  if(msg.author.bot || !msg.channel.guild) {
    return;
  }

  let prefix       = this.config.bot.prefix;
  let botMember    = msg.channel.guild.members.get(this.bot.user.id);
  let botMention   = `<@${botMember.nick ? '!' : ''}${botMember.id}>`;
  let botMentioned = msg.content.startsWith(botMention);

  if(!msg.content.startsWith(prefix) && !botMentioned) {
    return;
  }

  let i18n    = this.i18n[this.config.bot.locales[0]];
  let isOwner = msg.author.id === this.config.bot.owner.id;

  let prefixLength      = botMentioned ? botMention.length + 1 : prefix.length;
  let cleanPrefixLength = botMentioned ? `@${botMember.nick || botMember.username}`.length + 1 : prefix.length;

  let [command, ...args] = msg.content.slice(prefixLength).split(/\s+/g);
  let cleanArgs = msg.cleanContent.slice(cleanPrefixLength).split(/\s+/g).slice(1);

  command = command && (this.commands[command] || this.commands.aliases[command]);

  if(!command || (command.settings.ownerOnly && command.settings.ownerOnly !== isOwner)) {
    return;
  }

  let result = await command.run({
    app: this,
    msg,
    args,
    cleanArgs,
    i18n,
    prefix
  });

  if(!result) {
    return;
  } else if(typeof result === 'string') {
    return await this.bot.createMessage(msg.channel.id, result);
  } else if(Array.isArray(result) && result.length > 0) {
    return await this.bot.createMessage(msg.channel.id, result[Math.floor(Math.random() * result.length)]);
  }

  // try {
  //
  // } catch(error) {
  //   this.logger.error(error.stack);
  // }
};