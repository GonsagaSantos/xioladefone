import wweb from 'whatsapp-web.js';
const { Client, LocalAuth } = wweb;
import { criarTabelas } from './services/criarTabelas.js';
import ping from './handlers/ping.js';
import { help } from './handlers/help.js';
import { motor } from './handlers/mainHandler.js';

export const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: false,
        //executablePath: '/usr/bin/google-chrome',
        args: ['--disable-gpu', '--no-sandbox']
      }
  });

const usuariosPermitidos = [
    "120363158758153954@g.us" //xiolas
    //"120363223636042606@g.us" lombrados
]

// ====================== Inicialização e Autenticação ========================

// client.on('qr', (qr) => {
//     console.log("QR RECEIVED");
//     qrcode.generate(qr, { small: true });
// });

client.initialize();

let pairingCodeRequested = false;
client.on('qr', async (qr) => {
    console.log('QR RECEIVED', qr);

    const pairingCodeEnabled = false;
    if (pairingCodeEnabled && !pairingCodeRequested) {
        const pairingCode = await client.requestPairingCode('5511910618287');
        console.log('Pairing code enabled, code: '+ pairingCode);
        pairingCodeRequested = true;
    }
});

client.on('authenticated', () => {
    console.log('✅ AUTHENTICATED');

});

client.on('auth_failure', msg => {
    console.error('❌ AUTHENTICATION FAILURE', msg);
});

criarTabelas();

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