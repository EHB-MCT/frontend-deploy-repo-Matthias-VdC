import { createAudioPlayer, createAudioResource, entersState, joinVoiceChannel, VoiceConnectionStatus } from "@discordjs/voice";
import fs from "fs";
import ytdl from "ytdl-core";

const queue = [];

export default async function play(message) {
    if (message.member.voice.channel !== null) {
        console.log("Joining voice channel!");
        const connection = joinVoiceChannel({
            channelId: message.member.voice.channelId,
            guildId: message.member.guild.id,
            selfDeaf: true,
            selfMute: false,
            adapterCreator: message.guild.voiceAdapterCreator,
        });
        try {
            const songUrl = message.content.split(" ");
            console.log(songUrl);
            const songInfo = await ytdl.getInfo(songUrl[1]);

            const song = {
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url,
                author: songInfo.videoDetails.author.name,
            }

            message.reply(`Now playing: ${song.title} from ${song.author}`);

            console.log(song);

            const stream = ytdl(songUrl[1], { filter: "audioonly" });
            const player = createAudioPlayer();
            const resource = createAudioResource(stream, { inlineVolume: true });
            resource.volume.setVolume(0.06);
            (async function play() {
                await player.play(resource);
                connection.subscribe(player);
            })();
        } catch (err) {
            connection.destroy();
            throw err;
        }
    } else {
        message.reply("You are currently not in a voice channel!");
    }
}