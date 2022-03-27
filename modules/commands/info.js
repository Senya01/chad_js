const db = require('../db')

module.exports = {
    name: 'info',
    description: 'Информация о голосовом онлайне',

    run: (interaction) => {
        if (interaction.member.id !== '357078249978855425') return {
            type: 'error',
            title: 'Ошибка!',
            description: 'Ты не <@!357078249978855425>'
        }

        const embeds = []
        db.dataBase(
            `SELECT \`voice_id\`, \`user_id\`, \`type\`, \`datetime\` FROM \`voice_time\` WHERE \`deleted\` = '0';`,
            (results) => {
                results.forEach(info => {
                    const type = info.type
                    const color = config.colors[type === 'join' ? 'success' : 'danger']
                    embeds.push({
                        title: 'Информация',
                        description: `<@!${info.user_id}> ${type === 'join' ? 'вошёл в' : 'вышел из'} <#${info.voice_id}>\n<t:${info.datetime}:f>`,
                        color: color
                    })
                })

                interaction.reply({
                    embeds: embeds
                })
            })

        return true
    }
}
