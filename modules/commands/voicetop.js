const fetch = require('node-fetch');


function secondsToDhms(seconds) {
    seconds = Number(seconds);
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor(seconds % (3600 * 24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.floor(seconds % 60);

    const dDisplay = d > 0 ? d + (d === 1 ? " день, " : " дней, ") : "";
    const hDisplay = h > 0 ? h + (h === 1 ? " час, " : " часов, ") : "";
    const mDisplay = m > 0 ? m + (m === 1 ? " минута, " : " минут, ") : "";
    const sDisplay = s > 0 ? s + (s === 1 ? " секунда" : " секунд") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

function formatPlace(place) {
    const emojis = [':first_place:', ':second_place:', ':third_place:']
    return emojis.includes(emojis[place - 1]) ? emojis[place - 1] : `${place}.`
}

module.exports = {
    name: 'voicetop',
    description: 'Топ голосового онлайна',

    run: (interaction) => {
        const description = []
        let url = `http://${config.api.host}:${config.api.port}/time/${interaction.member.id}`

        let settings = {method: "get"}

        fetch(url, settings)
            .then(res => res.json())
            .then((json) => {
                const users = json.users
                Object.entries(users).forEach(([key, value], idx) => {
                    if (idx < 10) {
                        let place = idx + 1
                        place = formatPlace(place)
                        description.push(`${place} <@!${key}>: ${secondsToDhms(value)}`)
                    }
                })

                const info = [
                    `Твоё место: ${formatPlace(json.place)}`,
                    `Твоё время: ${secondsToDhms(json.time)}`,
                    `Начало статистики: <t:${json.first_timestamp}:R>`,
                    `Статистика на: <t:${Math.floor(Date.now() / 1000)}:R>`
                ]

                const avatar = interaction.member.user.avatarURL() ? interaction.member.user.avatarURL() : interaction.member.user.defaultAvatarURL

                    interaction.reply({
                    embeds: [{
                        title: 'Голосовой онлайн ТОП-10:',
                        description: `${info.join('\n')}\n\n${description.join('\n')}`,
                        color: config.colors.primary,
                        author: {
                            name: interaction.member.user.tag,
                            iconURL: avatar
                        }
                    }]
                })
            })

        return true
    }
}
