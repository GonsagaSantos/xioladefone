// Adicionar os comandos criados aqui

import { addPessoaGen } from '../handlers/addGenero.js'; 
import  ping  from '../handlers/ping.js';
import { help } from '../handlers/help.js';

export const comandosValidos = {
    '!add': addPessoaGen,
    '!ping': ping,
    '!help': help
    // '!remove',
    // '!consultatags',
    // '!ConsultaTags',
    // '!minhasmarcacoes', 
    // '!consultapessoas',
    // '@@',
    // '!ajuda',
    // '!addPlaylist',
    // '!removePlaylist',
};