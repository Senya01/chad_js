module.exports = {
    run: (message) => {
        if (message.author.bot) return
        if (message.author.id !== '357078249978855425') return
        if (message.content === '!get_role') {
            if (message.author.id !== '357078249978855425') return
            message.channel.send({
                embeds: [{
                    title: 'Получить роли',
                    description: 'Нажми на кнопку и выбери необходимые роли',
                    color: config.colors.primary
                }],
                components: [{
                    type: 'ACTION_ROW', components: [{
                        type: 'BUTTON',
                        label: 'Получить роли',
                        customId: 'get_roles',
                        style: 'PRIMARY',
                        emoji: null,
                        url: null,
                        disabled: false
                    }]
                }]
            })

            return
        }

        if (message.content === '!sc_update') {
            if (message.author.id !== '357078249978855425') return

            let slashCommands = Array.from(CM.commands.values())
                .map(({ name, description }) => ({ name, description }))

            bot.application.commands.set(slashCommands, message.guildId)
        }
    }
}
