const Discord = require("discord.js")
const bot = new Discord.Client({
    intents: ["GUILDS", "GUILD_BANS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_VOICE_STATES"]
})

config = require('./config.json')

bot.login(config.token)

bot.on('ready', () => {
    console.log(`Login as ${bot.user.tag} (${bot.user.id})...`)
})

// function buttons_map(buttons, size_row = 5) {
//     let result = {}
//     buttons.forEach((value, i) => {
//         const idx = Math.floor(i / size_row)
//         if (i % size_row === 0) result[idx] = []
//         result[idx] = result[idx].length === 0 ? [value] : [...result[idx], value]
//     })
//
//     return result
// }

function buttons_map(member, size_row = 5, size_column = 5) {
    let components = []
    const data = config.data

    for (let i = 0; i < Object.keys(data).length; i++) {
        const idx = Math.floor(i / size_row)
        if (size_column === idx - 1) break
        if (i % size_row === 0) components[idx] = {type: 'ACTION_ROW', components: []}

        const style = member._roles.indexOf(data[Object.keys(data)[i]].role_id) !== -1 ? 'PRIMARY' : 'SECONDARY'

        components[idx].components.push({
            type: 'BUTTON',
            label: '',
            customId: `role:${Object.keys(data)[i]}`,
            style: style,
            emoji: data[Object.keys(data)[i]].emoji,
            url: null,
            disabled: false
        })
    }

    return components
}

function get_roles(member) {
    let components = buttons_map(member)
    return {
        embeds: [{
            'title': 'Выберите роли'
        }],
        components: components,
        ephemeral: true
    }
}

function update_roles(message, game) {
    let data = message.message.components
    for (let i = 0; i < Object.keys(data).length; i++) {
        for (let j = 0; j < Object.keys(data[i].components).length; j++) {
            if (data[i].components[j].customId === `role:${game}`) {
                data[i].components[j].style = data[i].components[j].style === 'PRIMARY' ? 'SECONDARY' : 'PRIMARY'
            }
        }
    }
    message.update({
        embeds: message.message.embeds,
        components: message.message.components,
        ephemeral: true
    })
}

bot.on('messageCreate', message => {
    if (message.author.bot) return
    if (message.author.id !== '357078249978855425') return
    if (message.content !== '!get_role') return

    message.channel.send({
        embeds: [{
            'title': 'Получить роли'
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
})

bot.on('interactionCreate', message => {
    if (!message.isButton) return

    if (message.customId === 'get_roles') {
        message.reply(get_roles(message.member))
        return
    }

    const game = message.customId.split(':')[1]
    if (game) {
        const role_id = config.data[game].role_id
        const role = message.guild.roles.cache.get(role_id)
        if (message.member._roles.indexOf(role_id) !== -1) {
            message.member.roles.remove(role).then(() => {
                update_roles(message, game)
            })
        } else {
            message.member.roles.add(role).then(() => {
                update_roles(message, game)
            })
        }
    }
})
