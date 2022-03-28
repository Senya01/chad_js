const db = require('../db')
const main = require('../main')

module.exports = {
    name: 'p',
    description: 'Найти команду',

    run: (interaction) => {
        const voice = interaction.member.voice.channel

        if (!voice) return {
            type: 'error',
            title: 'Ошибка!',
            description: 'Ты должен находиться в голосовом канале, для использования этой команды'
        }

        if (!voice.userLimit) return {
            type: 'error',
            title: 'Ошибка!',
            description: 'В канале нет ограничений по количеству пользователей'
        }

        interaction.reply({
            embeds: [main.getTeamInfo(voice)],
            fetchReply: true
        })
            .then(message => {
                db.dataBase(
                    `INSERT INTO \`teams\`(\`channel_id\`, \`message_id\`, \`voice_id\`) VALUES ('${message.channelId}', '${message.id}', '${voice.id}');`,
                    () => {
                    })
            })
        return true
    }
}
