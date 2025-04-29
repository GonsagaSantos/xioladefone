const { Client, LocalAuth, GroupNotificationTypes } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const db = require('./dbManipulation.js');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  });

// const allowedGenres = [
//     "Soul", "Funk", "Jazz", "Blues", "RnB", "HipHop", "Rap", "Pop", "Rock", "Punk",
//     "Indie", "MPB", "Samba", "BossaNova", "Reggae", "Ska", "Trap", "Eletronica",
//     "House", "Techno", "Lofi", "Psychedelic", "Experimental", "Instrumental", "Classica",
//     "Metal", "Forro", "Sertanejo", "Pagode", "Drill", "Afrobeat", "Grime", "Kpop", "Jpop",
//     "Vaporwave", "Chillwave", "Ambient", "NewAge"
// ];

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
    // NOTE: This event will not be fired if a session is specified.
    console.log('QR RECEIVED', qr);

    // paiuting code example
    const pairingCodeEnabled = false;
    if (pairingCodeEnabled && !pairingCodeRequested) {
        const pairingCode = await client.requestPairingCode('5511910618287'); // enter the target phone number
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
    console.log("✅ Conectado!");
    db.createTable('GenresAndPeople');
});

// ======================== Manipulador Geral de Mensagens =====================

client.on('ready', async () => {
    console.log("✅ Conectado!");
});


client.on('message_create', async (message) => {

    // Ignore messages sent by the bot itself
    if (message.fromMe) return;

    // Check if the message is from the authorized group (replace with your group ID)
    const xiolas = "120363158758153954@g.us";
    const grupoTeste = "120363418368861974@g.us";
    const gruposAutorizados = [xiolas, grupoTeste];

    if (!gruposAutorizados.includes(message.from)) {
        console.log("O grupo/usuário tentando usar o bot não é autorizado.");
        //await message.reply("Não autorizado.");
        return;
    }

    try {
        if (!message.body || typeof message.body !== 'string') return;

        const text = message.body.trim();
        const senderId = (String(message.author || message.from).replace("@c.us", "")).trim();

        // !Ping
        if (text === "!Ping") {
            return message.reply("Pong!");
        }

        const regexLink = /https:\/\/open\.spotify\.com\/\S+/;
        const regexGenero = /@@(\w+)/;
        
        const link = message.body.match(regexLink)?.[0];
        const genre = message.body.match(regexGenero)?.[1];
        
        // Verifica se tem @@genero em qualquer parte da mensagem
        if (regexGenero.test(text)) {
            const matchGenero = text.match(regexGenero);
            const genreFromMessage = matchGenero[1];
        
            // if (!allowedGenres.includes(genreFromMessage)) {
            //     return message.reply("Estilo inválido.");
            // }
        
            const linkFromMessage = text.match(regexLink)?.[0];
            
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
        
        // !add genero
        if (text.startsWith("!add")) {
            const rawGenre = text.replace("!add", " ").trim();
            const genre = rawGenre.charAt(0).toUpperCase() + rawGenre.slice(1).toLowerCase();
            const groupId = message.from.replace("@g.us", " ").trim();
            console.log(`Original Text: ${rawGenre} -|- Text Char 0: ${rawGenre.charAt(0).toUpperCase()} -|- Text Sliced ${rawGenre.slice(1).toLowerCase()} -|- Final text: ${genre}`)

            // if (!allowedGenres.includes(genre)) {
            //     message.reply("Inválido.");
            // }

            console.log(`Adicionando usuário ${senderId} ao estilo ${genre}`);
            await db.addUsuario('GenresAndPeople', senderId, genre, groupId);
            message.reply(`Você foi adicionado à lista de ${genre}!`);
        }

        // !remove genero
        if (text.startsWith("!remove")) {
            const genre = text.replace("!remove", "").trim();
            if (!allowedGenres.includes(genre)) {
                return message.reply("Inválido.");
            }

            const resposta = await db.removerPessoas('GenresAndPeople', senderId, genre);
            return message.reply(resposta);
        }

        // @@genero
        if (text.startsWith("@@")) {
            const genre = text.replace("@@", "").trim();
            const groupId = message.from.replace("@g.us", " ").trim();
            console.log(groupId)
            // if (!allowedGenres.includes(genre)) {
            //     return message.reply("Estilo inválido.");
            // }

            const chat = await message.getChat();
            const { usuarios, usuariosComC } = await db.marcarPessoas('GenresAndPeople', genre, groupId);

            if (usuarios.length === 0) {
                return message.reply(`Ninguém ouve ${genre} ainda.`);
            }

            const textoComMentions = usuarios.map(id => `@${id}`).join('\n');
            return chat.sendMessage(`${genre}:\n${textoComMentions}`, {
                mentions: usuariosComC
            });
        }

        // !consultaTags
        if(text.startsWith("!ConsultaTags")){
            db.consultaTabela("GenresAndPeople")
            .then((generos) => {
              const lista = generos.join(", ");
              message.reply(`Estilos disponíveis: ${lista}`);
            })
            .catch((err) => {
              console.error("Erro ao consultar tabela:", err.message);
              message.reply("Erro ao listar os estilos.");
            });
        }

        //minhas marcacoes
        if(text.startsWith("!minhasmarcacoes")){
            db.consultarGenerosMarcados("GenresAndPeople", senderId)
            .then((generos) => {
                const lista = generos.join('\n');
                message.reply(`Gêneros que você será marcado: ${lista}`);
            })
            .catch((err) => {
                console.error("Deu erro: ", err.message);
                message.reply("Erro ao listar seus estilos.");
            })
        }

    } catch (err) {
        console.error("Erro ao processar mensagem:", err);
        message.reply("Ocorreu um erro ao processar sua mensagem.");
    }
});

// ============================ Inicializa ===========================
