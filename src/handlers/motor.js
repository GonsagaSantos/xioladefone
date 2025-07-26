import { comandosValidos } from '../utils/comandosValidos.js';

export function motor(client) {

    client.on('message_create', async (message) => { 
        if (message.fromMe) return; //se a mensagem for do proprio bot ele ignora
        console.log(`${message.author} disse: ${message.body}`);
        
        const mensagem = typeof message.body === 'string' ? message.body.toLowerCase() : ''; // converte a mensagem para minúsculas
        const comando = comandosValidos[mensagem.split(' ')[0]]; // pega o comando da mensagem

        if (comando) {
            try {
                console.log('Executando comando:', mensagem);
                comando(message, client);
            } catch (error) {
                console.error('Erro ao executar comando:', error);
            }
        } else {
            console.log('Comando inválido:', mensagem);
        }
    });
}