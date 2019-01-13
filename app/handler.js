module.exports = async function(msg) {
  if(msg.author.bot || !msg.channel.guild) {
    return;
  }

  let isOwner      = msg.author.id === this.config.bot.owner.id;
  let prefix       = this.config.bot.prefix;
  let locale       = this.config.bot.default_locale;
  let botMember    = msg.channel.guild.members.get(this.bot.user.id);
  let botMention   = `<@${botMember.nick ? '!' : ''}${botMember.id}>`;
  let botMentioned = msg.content.startsWith(botMention);

  if(!msg.content.startsWith(prefix) && !botMentioned) {
    return;
  }

  let prefixLength      = botMentioned ? botMention.length + 1 : prefix.length;
  let cleanPrefixLength = botMentioned ? `@${botMember.nick || botMember.username}`.length + 1 : prefix.length;

  let [command, ...args] = msg.content.slice(prefixLength).split(/\s+/g);
  let cleanArgs = msg.cleanContent.slice(cleanPrefixLength).split(/\s+/g).slice(1);

  let result = `${command} ${args.join(',')}`;

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
