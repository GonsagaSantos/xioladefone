function verificarComando(msg) { //pra caso a pessoa erre o comando
    const palavra = msg.split(" ")[0]; // pega só o primeiro termo
    const sugestao = similarity.findBestMatch(palavra, comandosValidos);

    if (sugestao.bestMatch.rating > 0.6 && palavra !== sugestao.bestMatch.target) {
        return `Você quis dizer: *${sugestao.bestMatch.target}*?`;
    }
    return null;
}

export { verificarComando };
import similarity from 'string-similarity';