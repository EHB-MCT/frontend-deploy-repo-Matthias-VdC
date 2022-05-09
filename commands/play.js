import { entersState, joinVoiceChannel, VoiceConnectionStatus } from "@discordjs/voice";
import fs from "fs";


// const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

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


    try {
        await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
        // if (!queue) {

        // } else {
        //     queue.push(song);
        //     console.log(queue.songs);
        //     message.reply(`${song.title} has beed added to the queue!`);
        //     ytdl(song.url)
        //         .pipe(fs.createWriteStream(''))
        // }
        return connection;
    } catch (err) {
        connection.destroy();
        throw err;
    }
}