const { createAudioPlayer, createAudioResource, VoiceConnectionStatus, joinVoiceChannel, AudioPlayerStatus, AudioPlayer} = require('@discordjs/voice');
const ytdl = require('ytdl-core-discord')

const player = createAudioPlayer();
const queue = [];
var playing = null;
var connection = null;

class Entry {
    constructor(url) {
        this.url = url;
    }

    async init() {
        this.info = (await ytdl.getBasicInfo(this.url, {downloadURL: true})).videoDetails;
    }

    async encode() {
        return await ytdl(this.url, {type: "opus", filter: "audioonly"});
    }
}

exports.join = async function(channelId, guildId, adapterCreator) {
    connection = await joinVoiceChannel({
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
    return entry.info;
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
    return player.state.status === AudioPlayerStatus.Paused || player.state.status == AudioPlayerStatus.AutoPaused;
}

exports.isPlaying = function() {
    return player.state.status === AudioPlayerStatus.Playing;
}

exports.isEmpty = function() {
    return queue.length === 0;
}

exports.getQueue = function() {
    return queue.map(entry => entry.info);
}

exports.current = function() {
    return playing;
}

// Auto play on initial subscription
player.addListener('subscribe', async subscription => {
    if (player.state.status === AudioPlayerStatus.Paused) {
        player.unpause();
    } else if (queue.length > 0) {
        await playNext();
    }
})

// Auto pause on unsubscription
player.addListener('unsubscribe', async subscription => {
    player.pause();
})

// Auto play next on idle
player.on(AudioPlayerStatus.Idle, async () => {
    playing = null;
    await playNext();
})

async function playNext() {
    if (queue.length > 0) {
        let current = queue.shift();
        playing = current.info;
        let stream = await current.encode();
        await player.play(createAudioResource(stream, {seek: 0, volume: 1}));
    } else {
        await connection.destroy();
    }
}

