module.exports = {
    run: (interaction) => {
        let command = CM.commands.get(interaction.commandName)
        const result = command.run(interaction)
        if (result === true) return
        if (result.type !== 'error') return

        interaction.reply({
            embeds: [{
                title: result.message,
                color: config.colors.danger,
                description: result.message
            }],
            ephemeral: true
        })
    }
}
