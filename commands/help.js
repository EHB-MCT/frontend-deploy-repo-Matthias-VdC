export default function help(message, commands) {
    let response = "Available commands are:";
    for (let command of commands) response += `\n !${command}`;
    message.reply(response);
}