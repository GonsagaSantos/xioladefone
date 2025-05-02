const { Client, LocalAuth, GroupNotificationTypes } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const db = require('./dbManipulation.js');
const similarity = require("string-similarity");

const client = new Client({
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
    // NOTE: This event will not be fired if a session is specified.
    console.log('QR RECEIVED', qr);

    // paiuting code example
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
    console.log("✅ Conectado!");
    db.createTable('GenresAndPeople');
});

// ======================== Manipulador Geral de Mensagens =====================

client.on('ready', async () => {
    const currentTime = new Date().toLocaleString("pt-BR");

    const chats = await client.getChats();
    const groups = chats.filter(chat => chat.isGroup);

    console.log("✅ Conectado!");

    await client.sendMessage("120363418368861974@g.us", `Bot conectado em ${currentTime}`);
    // groups.forEach(group => {
    //     console.log(`Nome: ${group.name} | ID: ${group.id._serialized}`);
    // });
});

const comandosValidos = ['!add', '!remove', '!consultatags', '!ConsultaTags', '!minhasmarcacoes', '!consultapessoas', '@@', '!ajuda'];

function verificarComando(msg) { //pra caso a pessoa erre o comando
    const palavra = msg.split(" ")[0]; // pega só o primeiro termo
    const sugestao = similarity.findBestMatch(palavra, comandosValidos);

    if (sugestao.bestMatch.rating > 0.6 && palavra !== sugestao.bestMatch.target) {
        return `Você quis dizer: *${sugestao.bestMatch.target}*?`;
    }
    return null;
}

client.on('message_create', async (message) => {

    if (message.fromMe) return; //se a mensagem for do proprio bot ele ignora

    const mensagem = typeof message.body === 'string' ? message.body.toLowerCase() : '';
    
    const xiolas = "120363158758153954@g.us";
    const grupoTeste = "120363418368861974@g.us";
    const grupoFatec = "120363223636042606@g.us";
    const grupoLogs = "120363418165585515@g.us";
    const gruposAutorizados = [xiolas, grupoTeste, grupoFatec, grupoLogs];

    if (!gruposAutorizados.includes(message.from)) {
        console.log("O grupo/usuário tentando usar o bot não é autorizado.");
        return;
    }

    try {
        if (!message.body || typeof message.body !== 'string') return;

        const text = message.body.trim();
        const senderId = (String(message.author || message.from).replace("@c.us", "")).trim();

        // !Ping
        if (mensagem === "!ping") {
            return message.reply("Pong!");
        }

        const regexLink = /https:\/\/open\.spotify\.com\/\S+/;
        const regexGenero = /@@(\w+)/;
        
        const link = message.body.match(regexLink)?.[0];
        const genre = message.body.match(regexGenero)?.[1];
        
        // Verifica se tem @@genero em qualquer parte da mensagem
        if (regexGenero.test(mensagem)) {
            const matchGenero = mensagem.match(regexGenero);
            const genreFromMessage = matchGenero[1];
        
            // if (!db.consultaTabela('GenresAndPeople').includes(genreFromMessage)) {
            //     return message.reply("Estilo inválido.");
            // }
        
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
        
        // !add genero
        if (mensagem.startsWith("!add")) {
            const genre = mensagem.replace("!add", " ").trim();
            // const genre = rawGenre.charAt(0).toUpperCase() + rawGenre.slice(1).toLowerCase();
            const groupId = message.from.replace("@g.us", " ").trim();

            console.log(`Adicionando usuário ${senderId} ao estilo ${genre}`);
            await db.addUsuario('GenresAndPeople', senderId, genre, groupId);
            message.reply(`Você foi adicionado à lista de ${genre}!`);
        }

        // !remove genero
        if (mensagem.startsWith("!remove")) {
            const genre = text.replace("!remove", " ").trim();
            // if (!db.consultaTabela('GenresAndPeople').includes(genre)) {
            //     return message.reply("Estilo inválido.");
            // }

            const resposta = await db.removerPessoas('GenresAndPeople', senderId, genre);
            return message.reply(resposta);
        }

        // @@genero
        if (mensagem.startsWith("@@")) {
            const genre = mensagem.replace("@@", " ").trim();
            const groupId = message.from.replace("@g.us", " ").trim();

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

        // !consultaPessoas
        // if (mensagem.startsWith("!consultapessoas")) {
        //     const genre = mensagem.replace("!consultapessoas", " ").trim();
        //     const groupId = message.from.replace("@g.us", " ").trim();

        //     const chat = await message.getChat();
        //     const usuarios = await db.marcarPessoas('GenresAndPeople', genre, groupId);

        //     if (usuarios.length === 0) {
        //         return message.reply(`Ninguém ouve ${genre} ainda.`);
        //     }

        //     return chat.sendMessage(`${genre}:\n ${usuarios}`);
        // }                                                                                        implementar depois

        // !consultaTags
        if(mensagem.startsWith("!consultatags")){
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
        if(mensagem.startsWith("!minhasmarcacoes")){
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
        
        //ajuda com os comandos
        if (mensagem.startsWith("!ajuda")) {
            message.reply(
                `🎧 *Xiolers de Fone - Comandos Disponíveis* 🎧

📌 *!add <gênero>*  
Te cadastra em um gênero musical. Você será marcade sempre que alguém marcar esse gênero.
Exemplo: !add Jazz

📌 *!remove <gênero>*  
Re remove das marcações do gênero indicado.
Exemplo: !remove Jazz

📌 *@@<gênero>*  
Marca todos os usuários cadastrados no gênero.
Exemplo: @@Jazz

📌 *!ConsultaTags*  
Lista todos os gêneros musicais disponíveis.

📌 *!minhasmarcacoes*  
Mostra todos os gêneros nos quais você está cadastrado.`
            );
        }      

        const sugestao = verificarComando(message.body);
        if (sugestao) {
            client.sendMessage(message.from, sugestao);
            return;
        }

    } catch (err) {
        const currentTime = new Date().toLocaleString("pt-BR");
        client.sendMessage("120363418165585515@g.us", `Erro as ${currentTime}\nVinda de ${message.from} (Consultar no código)\n\n${String(err)}`);

        console.error("Erro ao processar mensagem:", err);
        message.reply("deu erro kkkkkkkkkkkkkk perai");

    }
});