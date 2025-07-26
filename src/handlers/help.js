export function help(message) {
    message.reply(
                `🎧 *XiolaFM - Comandos Disponíveis* 🎧

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