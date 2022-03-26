module.exports = {
    // buttonsMap: (buttons, size_row = 5) => {
    //     let result = {}
    //     buttons.forEach((value, i) => {
    //         const idx = Math.floor(i / size_row)
    //         if (i % size_row === 0) result[idx] = []
    //         result[idx] = result[idx].length === 0 ? [value] : [...result[idx], value]
    //     })
    //
    //     return result
    // },
    buttonsMap: (member, size_row = 5, size_column = 5) => {
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
    },
    updateRoles: (interaction, game) => {
        let data = interaction.message.components
        for (let i = 0; i < Object.keys(data).length; i++) {
            for (let j = 0; j < Object.keys(data[i].components).length; j++) {
                if (data[i].components[j].customId === `role:${game}`) {
                    data[i].components[j].style = data[i].components[j].style === 'PRIMARY' ? 'SECONDARY' : 'PRIMARY'
                }
            }
        }

        interaction.update({
            components: interaction.message.components,
        })
    }
}
