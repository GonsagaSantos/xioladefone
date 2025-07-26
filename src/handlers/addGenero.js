export async function addPessoaGen(mensagem) {   
    // !add genero
    const genre = mensagem.body.replace("!add", " ").trim();
    // const genre = rawGenre.charAt(0).toUpperCase() + rawGenre.slice(1).toLowerCase();
    const idGrupo = mensagem.from.replace("@g.us", " ").trim();
    const idUsuario = mensagem.author; 
    const nome = mensagem.author;

    console.log(`Adicionando usuário ${idUsuario} ao estilo ${genre}`);
    const retornoAddUsuario = await addUsuario(idUsuario, idGrupo, nome);
    const retornoAddUsuarioGenero = await addUsuarioGenero(idUsuario, genre);
    const retornoAddGenero = await addGenero(genre);
    const retorno = `${retornoAddUsuario}\n${retornoAddUsuarioGenero}\n${retornoAddGenero}`;
    mensagem.reply(retorno);
}

import { addUsuario, addUsuarioGenero } from '../database/usuarioRepository.js';
import { addGenero } from '../database/generoRepository.js';