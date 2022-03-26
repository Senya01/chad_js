module.exports = {
    name: 'p',
    description: 'Найти команду',

    run: (interaction) => {
        let users = []
        const voice = interaction.member.voice.channel
        if (!voice) return {
            type: 'error',
            title: 'Ошибка!',
            message: 'Ты должен находиться в канале, для использования этой команды'
        }
        let type = ''
        let subData = ''
        const members = voice.members
        const membersCount = members.size
        const userLimit = voice.userLimit
        if (!userLimit) return {
            type: 'error',
            title: 'Ошибка!',
            message: 'В канале нет ограничений по количеству пользователей'
        }
        if (membersCount === userLimit) {
            type = 'full'
        } else if (membersCount < userLimit) {
            type = 'search'
            subData = `+${userLimit - membersCount}`
        } else if (membersCount > userLimit) {
            type = 'crowded'
            subData = `-${membersCount - userLimit}`
        }

        let text = config.types[type].text.replace('{}', subData)
        members.map((member) => {
            users.push(`<@!${member.id}>`)
        })

        if (type === 'search') {
            for (let i = 0; i < userLimit - membersCount; i++) {
                users.push('[Пусто]')
            }
        }

        interaction.reply({
            embeds: [{
                title: `${voice.name} ${text}`,
                description: users.join('\n'),
                color: config.colors[config.types[type].color]
            }]
        }).then(message => {
            console.log(message)
        })

        return true
    }
}

/*
interaction.reply({
    embeds: [{
        title: 'Apex [711]',
        description: players.join('\n')
    }]
}).then(message => {
    console.log(message)
})
*/
