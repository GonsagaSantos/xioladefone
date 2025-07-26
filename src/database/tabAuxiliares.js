import dbPromise from './db/connection.js';

const db = await dbPromise;

async function createTablePlaylistMusica() {
    return new Promise((resolve, reject) => {
        db.run(`
            CREATE TABLE IF NOT EXISTS PlaylistMusica (
                idPlaylist INTEGER REFERENCES Playlists(idPlaylist),
                idMusica INTEGER REFERENCES Musicas(idMusica)
            );`, (err) => {
                if (err) {
                    console.error("Erro ao criar tabela:", err.message);
                }
                else {
                    console.log("Tabela PlaylistMusica criada com sucesso!");
                }
            })
    })
}

async function createTableGenerosPessoa() {
    return new Promise((resolve, reject) => {
        db.run(`
            CREATE TABLE IF NOT EXISTS GenerosPessoa (
                idUsuario TEXT REFERENCES Usuarios(idUsuario),
                idGenero INTEGER REFERENCES Generos(idGenero)
            );`, (err) => {
                if (err) {
                    console.error("Erro ao criar tabela:", err.message);
                }
                else {
                    console.log("Tabela GenerosPessoa criada com sucesso!");
                }
            })
    })
}

async function createTableGrupoPessoa() { 
    return new Promise((resolve, reject) => {
        db.run(`
            CREATE TABLE IF NOT EXISTS GruposPessoa (
                idUsuario TEXT REFERENCES Usuarios(idUsuario),
                idGrupo TEXT REFERENCES Grupos(idGrupo)
            );`, (err) => {
                if (err) {
                    console.error("Erro ao criar tabela:", err.message);
                }
                else {
                    console.log("Tabela GruposPessoa criada com sucesso!");
                }
            })
    })
}

export { createTablePlaylistMusica, createTableGenerosPessoa, createTableGrupoPessoa };