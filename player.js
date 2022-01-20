const { createAudioPlayer, createAudioResource, VoiceConnectionStatus, joinVoiceChannel, AudioPlayerStatus} = require('@discordjs/voice');
const ytdl = require('ytdl-core')

const player = createAudioPlayer();
const queue = [];

class Entry {
    constructor(url) {
        this.url = url;
    }

    async init() {
        let stream = await ytdl(this.url, {filter: "audioonly"});
        this.resource = await createAudioResource(stream, {seek: 0, volume: 1});
        this.info = (await ytdl.getBasicInfo(this.url, {downloadURL: true})).videoDetails;
    }
}

exports.join = async function(channelId, guildId, adapterCreator) {
    let connection = await joinVoiceChannel({
        channelId: channelId,
        guildId: guildId,
        adapterCreator: adapterCreator
    })
    connection.on(VoiceConnectionStatus.Ready, () => {
        console.log("Connected to voice channel")
    })
    await connection.subscribe(player);
}

exports.play = async function(url) {
    let entry = new Entry(url);
    await entry.init();
    queue.push(entry);
    if (queue.length === 1 && player.state.status === AudioPlayerStatus.Idle) {
        playNext();
    }
}

exports.resume = function() {
    player.unpause();
}

exports.pause = function() {
    player.pause();
}

exports.skip = function() {
    player.stop();
    playNext();
}

exports.clear = function() {
    player.stop();
    queue.length = 0;
}

exports.isPaused = function() {
    return player.state.status === AudioPlayerStatus.Paused;
}

exports.isPlaying = function() {
    return player.state.status === AudioPlayerStatus.Playing;
}

exports.listAll = function() {
    return queue.map(entry => entry.info);
}

// Auto play next on idle
player.on(AudioPlayerStatus.Idle, () => {
    playNext();
})

function playNext() {
    if (queue.length > 0) {
        player.play(createAudioResource(queue.shift().resource, {seek: 0, volume: 1}));
    }
}

