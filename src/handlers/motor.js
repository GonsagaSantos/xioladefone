import client from '../main.js';
import  ping  from './ping.js';
import { createTableGrupos, addGrupo, consultarGrupo } from './database/grupoRepository.js'; 
import { comandosValidos } from '../utils/comandosValidos.js';
import { verificarComando } from './verificaComando.js';
import { help } from './help.js';


client.on('ready', async () => {
    const currentTime = new Date().toLocaleString("pt-BR");

    const chats = await client.getChats();
    const groups = chats.filter(chat => chat.isGroup);

    console.log("✅ Conectado!");

    await client.sendMessage("120363418368861974@g.us", `Bot conectado em ${currentTime}`);
});

function motor() {

    client.on('message_create', async (message) => { 
        if (message.fromMe) return; //se a mensagem for do proprio bot ele ignora

        const mensagem = typeof message.body === 'string' ? message.body.toLowerCase() : ''; // converte a mensagem para minúsculas
        
        try {
            if (!comandosValidos.includes(mensagem)) return;
    
            switch (mensagem) {
                case mensagem == '!ping':
                    console.log("Ping recebido");
                    ping(message);
                break;
    
                case mensagem == '!ajuda':
                    help(message);
                break;
            } 
        } catch (err) {
            return;
        }
    });
}
    
export default motor;