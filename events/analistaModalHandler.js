const { EmbedBuilder } = require('discord.js');
const emojis = require('../DataBaseJson/emojis.json');
const analistaCargo = require('../DataBaseJson/analista.json')[0];

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isModalSubmit()) return;
    if (!interaction.customId.startsWith('modal_blacklist')) return;

    // Verifica se o usuário tem o cargo de analista
    if (!interaction.member.roles.cache.has(analistaCargo)) {
      return interaction.reply({
        content: `${emojis.negative_emoji} Apenas analistas podem usar este modal!`,
        ephemeral: true
      });
    }

    const motivoBlacklist = interaction.fields.getTextInputValue('motivo_blacklist');
    const customIdParts = interaction.customId.split(':');
    const targetUserId = customIdParts[1];
    const targetMessageId = customIdParts[2];
    const userMention = targetUserId ? `<@${targetUserId}>` : 'Usuário';

    const embedXitado = new EmbedBuilder()
      .setColor('#2b2d31')
      .setDescription(`${emojis._ban_emoji} O analista ${interaction.user} encontrou hack em ${userMention}!\n${emojis._text_emoji} **Motivo:** ${motivoBlacklist}`)
      .setTimestamp();

    await interaction.reply({
      embeds: [embedXitado],
      ephemeral: true
    });

    if (targetMessageId && interaction.channel) {
      try {
        const originalMessage = await interaction.channel.messages.fetch(targetMessageId);
        if (originalMessage && originalMessage.embeds.length > 0) {
          const updatedEmbed = EmbedBuilder.from(originalMessage.embeds[0]);
          const currentDesc = updatedEmbed.data.description || '';
          updatedEmbed.setDescription(
            `${currentDesc}\n${emojis._ban_emoji} **Resultado:** Usuário Xitado\n${emojis._text_emoji} **Motivo Blacklist:** ${motivoBlacklist}`
          );
          await originalMessage.edit({
            embeds: [updatedEmbed],
            components: []
          });
        }
      } catch (err) {
        console.error('Erro ao atualizar mensagem original da análise:', err);
      }
    }
  }
};