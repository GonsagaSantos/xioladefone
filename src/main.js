import wweb from 'whatsapp-web.js';
const { Client, LocalAuth } = wweb;
import { criarTabelas } from './services/criarTabelas.js';
import ping from './handlers/ping.js';
import { help } from './handlers/help.js';
import { motor } from './handlers/motor.js';

export const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
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

client.on('ready', async () => {
    const currentTime = new Date().toLocaleString("pt-BR");

    const chats = await client.getChats();
    const groups = chats.filter(chat => chat.isGroup);

    console.log("✅ Conectado!");

    await client.sendMessage("120363418368861974@g.us", `Bot conectado em ${currentTime}`);
    
    criarTabelas();
    motor(client);
});