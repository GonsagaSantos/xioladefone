import dbPromise from './db/connection.js';

const db = await dbPromise;

function createTablePlaylists() {
    db.run(`
        CREATE TABLE IF NOT EXISTS Playlists (
            idPlaylist INTEGER PRIMARY KEY AUTOINCREMENT,
            idGrupo TEXT REFERENCES Grupos(idGrupo),
            nome TEXT
        );`, (err) => {
            if (err) {
                console.error("Erro ao criar tabela:", err.message);
            }
            else {
                console.log("Tabela Playlists criada com sucesso!");
            }
        });
}

// A ideia é adicionar uma playlist por genero, mas acho uma boa deixar os usuarios adicionarem as proprias
// Por exemplo, a gente cria umas playlists públicas, talvez se tiver um comando pra adicionar na playlist
// !addPlaylist <Nome> e !add <URL> <Nome da Playlist>
function addPlaylist(idPlaylist, idGrupo, nome) { 
    return new Promise((resolve, reject) => {

        const query = `INSERT INTO Playlists (idPlaylist, idGrupo, nome) VALUES (?, ?, ?)`;
        db.run(query, [idPlaylist, idGrupo, nome], function(err) {
            if (err) {
                return reject(err);
            }
            resolve(`Playlist ${nome} adicionada com sucesso!`);
        });
    });
}

function removePlaylist(idPlaylist) {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM Playlists WHERE idPlaylist = ?`;
        db.run(query, [idPlaylist], function(err) {
            if (err) {
                return reject(err);
            }
            resolve(`Playlist ${idPlaylist} removida com sucesso!`);
        });
    });
}

function consultarPlaylistPorId(idPlaylist) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM Musicas WHERE idPlaylist = ?`;
        db.run(query, [idPlaylist], function(err) {
            if (err) {
                return reject(err);
            }
            resolve(this);
        });
    });
}

async function consultarPlaylistsPorNome(nomePlaylist) {
    const query = `SELECT * FROM Playlists WHERE nome LIKE ?`;
    
    try {
        const rows = await db.all(query, [`%${nomePlaylist}%`]);
        return rows;
    } catch (err) {
        console.error("Erro ao consultar playlists:", err.message);
        throw err;
    }
}

export{createTablePlaylists};