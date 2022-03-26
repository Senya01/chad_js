const main = require('./main')

module.exports = {
    run: (interaction) => {
        if (interaction.customId === 'get_roles') {
            let components = main.buttonsMap(interaction.member)

            return interaction.reply({
                embeds: [{
                    title: 'Выберите роли'
                }],
                components: components,
                ephemeral: true
            })
        }

        const game = interaction.customId.split(':')[1]
        if (game) {
            const role_id = config.data[game].role_id
            const role = interaction.guild.roles.cache.get(role_id)
            if (interaction.member._roles.indexOf(role_id) !== -1) {
                interaction.member.roles.remove(role).then(() => {
                    main.updateRoles(interaction, game)
                })
            } else {
                interaction.member.roles.add(role).then(() => {
                    main.updateRoles(interaction, game)
                })
            }
        }
    }
}
