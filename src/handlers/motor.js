import  ping  from './ping.js';
// import { createTableGrupos, addGrupo, consultarGrupo } from './database/grupoRepository.js'; 
import { comandosValidos } from '../utils/comandosValidos.js';
import { verificarComando } from './verificaComando.js';
import { help } from './help.js';

export function motor(client) {

    client.on('message_create', async (message) => { 
        if (message.fromMe) return; //se a mensagem for do proprio bot ele ignora
        console.log(message.body);
        
        const mensagem = typeof message.body === 'string' ? message.body.toLowerCase() : ''; // converte a mensagem para minúsculas
        
        try {
            if (!comandosValidos.includes(mensagem)) return console.log("Comando inválido:", mensagem);
            switch (mensagem) {
                case '!ping':
                    console.log("Ping recebido");
                    ping(message);
                break;

                case '!ajuda':
                case '!help':
                    help(message);
                break;

                case '!add': 

            } 
        } catch (err) {
            return;
        }
    });
}