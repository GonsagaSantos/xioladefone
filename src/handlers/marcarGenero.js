import { regexGenero, regexLink } from '../utils/regex.js';

async function marcarGenero(message, db) {
    const link = message.body.match(regexLink)?.[0];
    const genre = message.body.match(regexGenero)?.[1];
    
    const matchGenero = message.match(regexGenero);
    const genreFromMessage = matchGenero[1];

            

    const linkFromMessage = mensagem.match(regexLink)?.[0];
    
    if (linkFromMessage) {
        const chat = await message.getChat();
        const { usuarios, usuariosComC } = await db.marcarPessoas('GenresAndPeople', genreFromMessage);

        if (usuarios.length === 0) {
            return message.reply(`Ninguém ouve ${genreFromMessage} ainda.`);
        }

        const textoComMentions = usuarios.map(id => `@${id}`).join('\n');
        return chat.sendMessage(`${genreFromMessage}:\n${textoComMentions}`, {
            mentions: usuariosComC
        });
    }   
}

export { marcarGenero };