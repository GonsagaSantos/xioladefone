// import wweb from 'whatsapp-web.js';
// const { Client, LocalAuth } = wweb;
// import { client } from '../main.js';
// import ping from './ping.js';
// import { addGrupo, consultarGrupo } from '../database/grupoRepository.js';
// import { verificarComando } from './verificaComando.js';
// import { help } from '../handlers/help.js';

// async function ready() {
//     client.on('ready', async () => {
//         const currentTime = new Date().toLocaleString("pt-BR");

//         const chats = await client.getChats();
//         const groups = chats.filter(chat => chat.isGroup);

//         console.log("✅ Conectado!");

//         await client.sendMessage("120363418368861974@g.us", `Bot conectado em ${currentTime}`);
//     });
// }

// function motor() {
//     // client.on('message_create', async (message) => {
    
//         if (message.fromMe) return console.log("mensagem minha"); //se a mensagem for do proprio bot ele ignora
    
//         const mensagem = typeof message.body === 'string' ? message.body.toLowerCase() : ''; // converte a mensagem para minúsculas
        
//         const xiolas = {idGrupo: "120363158758153954@g.us", nome: "xiolas"};
//         const grupoTeste = {idGrupo: "120363418368861974@g.us", nome: "grupo teste"};
//         const grupoFatec = {idGrupo: "120363223636042606@g.us", nome: "grupo fatec"};
//         const grupoLogs = {idGrupo: "120363418165585'515@g.us", nome: "grupo logs"};
//         const gruposAutorizados = [xiolas, grupoTeste, grupoFatec, grupoLogs];
    
//         for (const grupo of gruposAutorizados) {
//             try {
//                 await consultarGrupo(grupo.idGrupo);
//             } catch (err) {
//                 console.error("Erro ao consultar grupo:", err.message);
//             }
//             // addGrupo(grupo.idGrupo, grupo.nome);
//         }
    
//         if (!gruposAutorizados.includes(message.from)) {
//             console.log("O grupo/usuário tentando usar o bot não é autorizado.");
//             return console.log("Grupo/usuário não autorizado:", message.from);
//         }
    
//         try { // A função principal começa aqui
//             if (!message.body || typeof message.body !== 'string') return;
    
//             const text = message.body.trim();
//             const senderId = (String(message.author || message.from).replace("@c.us", "")).trim(); // Tira o sufixo do usuário
    
//             // Exemplo de comando chamando a função do handler
//             if (mensagem === "!ping") {
//                 ping(message);
//             }
    
//             const regexLink = /https:\/\/open\.spotify\.com\/\S+/;
//             const regexGenero = /@@(\w+)/;
            
//             const link = message.body.match(regexLink)?.[0];
//             const genre = message.body.match(regexGenero)?.[1];
            
//             // Verifica se tem @@genero em qualquer parte da mensagem
//             if (regexGenero.test(mensagem)) {
//                 const matchGenero = mensagem.match(regexGenero);
//                 const genreFromMessage = matchGenero[1];
            
//                 // if (!db.consultaTabela('GenresAndPeople').includes(genreFromMessage)) {
//                 //     return message.reply("Estilo inválido.");
//                 // }
            
//                 const linkFromMessage = mensagem.match(regexLink)?.[0];
                
//                 if (linkFromMessage) {
//                     const chat = await message.getChat();
//                     const { usuarios, usuariosComC } = await db.marcarPessoas('GenresAndPeople', genreFromMessage);
            
//                     if (usuarios.length === 0) {
//                         return message.reply(`Ninguém ouve ${genreFromMessage} ainda.`);
//                     }
            
//                     const textoComMentions = usuarios.map(id => `@${id}`).join('\n');
//                     return chat.sendMessage(`${genreFromMessage}:\n${textoComMentions}`, {
//                         mentions: usuariosComC
//                     });
//                 }   
//             }
            
//             // !add genero
//             if (mensagem.startsWith("!add")) {
//                 const genre = mensagem.replace("!add", " ").trim();
//                 // const genre = rawGenre.charAt(0).toUpperCase() + rawGenre.slice(1).toLowerCase();
//                 const groupId = message.from.replace("@g.us", " ").trim();
    
//                 console.log(`Adicionando usuário ${senderId} ao estilo ${genre}`);
//                 await db.addUsuario('GenresAndPeople', senderId, genre, groupId);
//                 message.reply(`Você foi adicionado à lista de ${genre}!`);
//             }
    
//             // !remove genero
//             if (mensagem.startsWith("!remove")) {
//                 const genre = text.replace("!remove", " ").trim();
//                 // if (!db.consultaTabela('GenresAndPeople').includes(genre)) {
//                 //     return message.reply("Estilo inválido.");
//                 // }
    
//                 const resposta = await db.removerPessoas('GenresAndPeople', senderId, genre);
//                 return message.reply(resposta);
//             }
    
//             // @@genero
//             if (mensagem.startsWith("@@")) {
//                 const genre = mensagem.replace("@@", " ").trim();
//                 const groupId = message.from.replace("@g.us", " ").trim();
    
//                 const chat = await message.getChat();
//                 const { usuarios, usuariosComC } = await db.marcarPessoas('GenresAndPeople', genre, groupId);
    
//                 if (usuarios.length === 0) {
//                     return message.reply(`Ninguém ouve ${genre} ainda.`);
//                 }
    
//                 const textoComMentions = usuarios.map(id => `@${id}`).join('\n');
//                 return chat.sendMessage(`${genre}:\n${textoComMentions}`, {
//                     mentions: usuariosComC
//                 });
//             }
    
    
//             // !consultaPessoas
//             // if (mensagem.startsWith("!consultapessoas")) {
//             //     const genre = mensagem.replace("!consultapessoas", " ").trim();
//             //     const groupId = message.from.replace("@g.us", " ").trim();
    
//             //     const chat = await message.getChat();
//             //     const usuarios = await db.marcarPessoas('GenresAndPeople', genre, groupId);
    
//             //     if (usuarios.length === 0) {
//             //         return message.reply(`Ninguém ouve ${genre} ainda.`);
//             //     }
    
//             //     return chat.sendMessage(`${genre}:\n ${usuarios}`);
//             // }                                                                                        implementar depois
    
//             // !consultaTags
//             if(mensagem.startsWith("!consultatags")){
//                 db.consultaTabela("GenresAndPeople")
//                 .then((generos) => {
//                   const lista = generos.join(", ");
//                   message.reply(`Estilos disponíveis: ${lista}`);
//                 })
//                 .catch((err) => {
//                   console.error("Erro ao consultar tabela:", err.message);
//                   message.reply("Erro ao listar os estilos.");
//                 });
//             }
    
//             //minhas marcacoes
//             if(mensagem.startsWith("!minhasmarcacoes")){
//                 db.consultarGenerosMarcados("GenresAndPeople", senderId)
//                 .then((generos) => {
//                     const lista = generos.join('\n');
//                     message.reply(`Gêneros que você será marcado: ${lista}`);
//                 })
//                 .catch((err) => {
//                     console.error("Deu erro: ", err.message);
//                     message.reply("Erro ao listar seus estilos.");
//                 })
//             }
            
//             //ajuda com os comandos
//             if (mensagem.startsWith("!ajuda")) {
//                 return help(mensagem);
//             }      
    
//             const sugestao = verificarComando(message.body);
//             if (sugestao) {
//                 client.sendMessage(message.from, sugestao);
//                 return;
//             }
    
//         } catch (err) {
//             const currentTime = new Date().toLocaleString("pt-BR");
//             client.sendMessage("120363418165585515@g.us", `Erro as ${currentTime}\nVinda de ${message.from} (Consultar no código)\n\n${String(err)}`);
    
//             console.error("Erro ao processar mensagem:", err);
//             message.reply("deu erro kkkkkkkkkkkkkk perai");
    
//         }
//     }
// // );
// // }

// export { motor };