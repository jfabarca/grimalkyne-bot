const logger = require('./utils/logger');
const { AppError } = require('./utils/errors');

const handler = async function(msg) {
  if (msg.author.bot) {
    return;
  }

  let prefixLength, cleanPrefixLength, isMentioned;

  const prefix = this.config.bot.prefix;

  if (msg.channel.guild) {
    const selfMember = msg.channel.guild.members.get(this.eris.user.id);
    const selfMention = `<@${selfMember.nick ? '!' : ''}${selfMember.id}>`;
    isMentioned = msg.content.startsWith(selfMention);
    prefixLength = isMentioned ? selfMention.length + 1 : prefix.length;
    cleanPrefixLength = isMentioned
      ? `@${selfMember.nick || selfMember.username}`.length + 1
      : prefix.length;
  } else {
    const selfMention = `<@${this.eris.user.id}>`;
    isMentioned = msg.content.startsWith(selfMention);
    prefixLength = isMentioned ? selfMention.length + 1 : prefix.length;
    cleanPrefixLength = isMentioned ? `@${this.eris.user.id}` : prefix.length;
  }

  if (!msg.content.startsWith(prefix) && !isMentioned) {
    return;
  }

  const isOwner = msg.author.id === this.config.bot.owner.id;

  const [srcCommand, ...args] = msg.content.slice(prefixLength).split(/\s+/g);

  const cleanArgs = msg.cleanContent
    .slice(cleanPrefixLength)
    .split(/\s+/g)
    .slice(1);

  const command =
    srcCommand &&
    (this.commands[srcCommand] || this.commands.aliases[srcCommand]);

  if (
    !command ||
    (command.settings.ownerOnly && command.settings.ownerOnly !== isOwner)
  ) {
    return;
  }

  const i18n = this.i18n.getLocale('es');

  try {
    const response = await command.run({
      app: this,
      msg,
      args,
      cleanArgs,
      i18n
    });

    if (!response) {
      return;
    } else if (typeof response === 'string') {
      return await this.eris.createMessage(msg.channel.id, response);
    } else if (Array.isArray(response) && response.length) {
      return await this.eris.createMessage(
        msg.channel.id,
        response[Math.floor(Math.random() * response.length)]
      );
    } else if (
      typeof response === 'object' &&
      typeof response.embed === 'object'
    ) {
      return await this.eris.createMessage(msg.channel.id, response);
    }
  } catch (err) {
    logger.error(err.stack);
  }
};

module.exports = handler;

// if(!result) {
//   return;
// } else if(typeof result === 'string') {
//   return await this.bot.createMessage(msg.channel.id, result);
// } else if(Array.isArray(result) && result.length > 0) {
//   return await this.bot.createMessage(msg.channel.id, result[Math.floor(Math.random() * result.length)]);
// } else if(typeof result === 'object' && result.embed) {
//   return await this.bot.createMessage(msg.channel.id, result);
// }
