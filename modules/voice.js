function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

module.exports = {
    run: (oldState, newState) => {
        let action = ''

        if (!oldState.channel && newState.channel) {
            action = 'join'
        } else if (oldState.channel && !newState.channel) {
            action = 'leave'
        } else if (oldState.channel && newState.channel && oldState.channel !== newState.channel) {
            action = 'move'
        } else {
            action = 'other'
        }

        if (action === 'join' || action === 'move') {
            if (newState.channel.name.indexOf('Создать') < 0) return

            const channel = newState.channel
            const category = channel.parent
            if (!category) return
            const rand = getRandomArbitrary(100, 999)
            category.createChannel(`${category.name} [${rand}]`, {
                type: 'GUILD_VOICE',
                bitrate: channel.bitrate,
                userLimit: channel.userLimit
            }).then(r => {
                newState.setChannel(r)
            })
        }

        if (action === 'leave' || action === 'move') {
            const channel = oldState.channel
            if (channel.members.size !== 0) return
            if (oldState.channel.name.indexOf('Создать') >= 0) return

            channel.delete()
        }

        /*
        if (action === 'other')
            newState.guild.channels.fetch('957238500850290710').then(channel => {
                let emoji_list = []

                const emojis = config.emojis
                emoji_list.push((newState.serverMute) ? `<:${emojis.ds_server_mute.name}:${emojis.ds_server_mute.id}>` : ``)
                emoji_list.push((newState.serverDeaf) ? `<:${emojis.ds_server_deafen.name}:${emojis.ds_server_deafen.id}>` : ``)
                emoji_list.push((newState.selfMute) ? `<:${emojis.ds_un_mute.name}:${emojis.ds_un_mute.id}>` : `<:${emojis.ds_mute.name}:${emojis.ds_mute.id}>`)
                emoji_list.push((newState.selfDeaf) ? `<:${emojis.ds_un_deafen.name}:${emojis.ds_un_deafen.id}>` : `<:${emojis.ds_deafen.name}:${emojis.ds_deafen.id}>`)
                emoji_list.push((newState.selfVideo) ? `<:${emojis.ds_camera.name}:${emojis.ds_camera.id}>` : ``)
                emoji_list.push((newState.streaming) ? `<:${emojis.ds_screen.name}:${emojis.ds_screen.id}>` : ``)

                channel.send({
                    embeds: [{
                        author: {
                            name: newState.member.user.tag,
                            iconURL: newState.member.user.avatarURL({format: "png"})
                        },
                        title: 'Инфо:',
                        description: emoji_list.join(' '),

                        fields: [
                            {
                                name: 'serverMute',
                                value: `${newState.serverMute}`,
                                inline: true
                            },
                            {
                                name: 'serverDeaf',
                                value: `${newState.serverDeaf}`,
                                inline: true
                            },
                            {
                                name: 'selfMute',
                                value: `${newState.selfMute}`,
                                inline: true
                            },
                            {
                                name: 'selfDeaf',
                                value: `${newState.selfDeaf}`,
                                inline: true
                            },
                            {
                                name: 'selfVideo',
                                value: `${newState.selfVideo}`,
                                inline: true
                            },
                            {
                                name: 'streaming',
                                value: `${newState.streaming}`,
                                inline: true
                            }
                        ]
                    }]
                })
            })
        }
        */
    }
}
