import { createAudioPlayer, createAudioResource, entersState, joinVoiceChannel, VoiceConnectionStatus } from "@discordjs/voice";
import fs from "fs";
import ytdl from "ytdl-core";

const queue = [];

export default async function play(message) {
    try {
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

        const stream = ytdl(songUrl[1], { filter: "audioonly" });
        const player = createAudioPlayer();
        const resource = createAudioResource(stream);
        resource.volume.setVolume(0.5);
        (async function play() {
            await player.play(resource);
            connection.subscribe(player);
        })();
    } catch (err) {
        connection.destroy();
        throw err;
    }
}