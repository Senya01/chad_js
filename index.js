const Discord = require("discord.js")
const fs = require('fs')

global.bot = new Discord.Client({
    intents: ["GUILDS", "GUILD_BANS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_VOICE_STATES"]
})

global.config = require('./config.json')

bot.login(config.token)
process.on('unhandledRejection', err => { console.log(err) })

bot.on('ready', () => {
    console.log(`Login as ${bot.user.tag} (${bot.user.id})...`)
})

const messageHandler = require('./modules/message')
bot.on('messageCreate', message => {
    messageHandler.run(message)
})

const buttonHandler = require('./modules/buttons')
const commandHandler = require('./modules/commands')
bot.on('interactionCreate', interaction => {
    if (interaction.isButton()) {
        return buttonHandler.run(interaction)
    }
    if (interaction.isCommand()) {
        return commandHandler.run(interaction)
    }
})

const voiceHandler = require('./modules/voice')
bot.on('voiceStateUpdate', (oldState, newState) => {
    voiceHandler.run(oldState, newState)
})

class CommandManager {
    constructor() {
        this.commands = new Map()
    }

    loadCommands() {
        const path = './modules/commands/'
        fs.readdirSync(path)
            .forEach(file => {
                const command = require(`${path}/${file}`)
                this.commands.set(command.name, command)
            })
    }
}

global.CM = new CommandManager()
CM.loadCommands()
