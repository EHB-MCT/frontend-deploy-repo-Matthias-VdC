import { Client } from "discord.js";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const client = new Client({
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"]
})

const commandPrefix = "!";

const commands = fs.readdirSync("./commands");

for (let i = 0; i < commands.length; i++) {
    commands[i] = commands[i].substring(0, commands[i].length - 3);
}

console.log(commands);

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`)
});

client.on("messageCreate", async message => {
    if (message.content.startsWith(commandPrefix)) {
        for (let i = 0; i < commands.length; i++) {
            if (new RegExp(`(?:^!${commands[i]})$`).test(message.content)) {
                let { default: command } = await import(`./commands/${commands[i]}.js`);
                command(message);
            }
        }
    }
});

if (process.env.TOKEN) {
    client.login(process.env.TOKEN);
} else {
    console.log("Token in .env is not correct, or empty!");
    process.exit(1);
}