import { createAudioPlayer, createAudioResource, entersState, joinVoiceChannel, VoiceConnectionStatus } from "@discordjs/voice";
import fs from "fs";
import ytdl from "ytdl-core";

const queue = [];

export default async function play(message) {
    console.log("Joining voice channel!");
    const connection = joinVoiceChannel({
        channelId: message.member.voice.channelId,
        guildId: message.member.guild.id,
        selfDeaf: true,
        selfMute: false,
        adapterCreator: message.guild.voiceAdapterCreator,
    });

    const songUrl = message.content.split(" ");
    console.log(songUrl);
    const songInfo = await ytdl.getInfo(songUrl[1]);

    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
    }

    console.log(song);

    try {
        const stream = ytdl(songUrl[1], { filter: "audioonly" });
        const player = createAudioPlayer();
        const resource = createAudioResource(stream);
        (async function play() {
            await player.play(resource);
            connection.subscribe(player);
        })();
    } catch (err) {
        connection.destroy();
        throw err;
    }
    // try {
    //     await entersState(connection, VoiceConnectionStatus.Ready, 30e3)
    //         .then(() => {
    //             console.log("Joined voice channel!");

    //             const player = createAudioPlayer();
    //             const resource = createAudioResource();

    //             const stream = ytdl(`${songUrl[1]}`, { filter: 'audioonly' });
    //             async function play() {
    //                 player.play(resource);
    //                 connection.subscribe(player);
    //             }
    //         })
    //     // if (!queue) {

    //     // } else {
    //     //     queue.push(song);
    //     //     console.log(queue.songs);
    //     //     message.reply(`${song.title} has beed added to the queue!`);
    //     //     ytdl(song.url)
    //     //         .pipe(fs.createWriteStream(''))
    //     // }
    //     return connection;
    // } catch (err) {
    //     connection.destroy();
    //     throw err;
    // }
}