import { createTableUsuarios } from '../database/usuarioRepository.js';
import { createTablePlaylistMusica, createTableGenerosPessoa, createTableGrupoPessoa  } from '../database/tabAuxiliares.js';
import { createTablePlaylists } from '../database/playlistRepository.js';
import { createTableMusicas } from '../database/musicaRepository.js';
import { createTableGrupos } from '../database/grupoRepository.js';
import { createTableGeneros } from '../database/generoRepository.js';

function criarTabelas() {
    createTableUsuarios();
    createTablePlaylistMusica();
    createTableGenerosPessoa();
    createTableGrupoPessoa();
    createTablePlaylists();
    createTableMusicas();
    createTableGrupos();
    createTableGeneros();
}

export{criarTabelas};