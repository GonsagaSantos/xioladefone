import dbPromise from './db/connection.js';

const db = await dbPromise;
function createTableMusicas() {
    db.run(`
        CREATE TABLE IF NOT EXISTS Musicas (
            idMusica TEXT PRIMARY KEY,
            nome TEXT,
            artista TEXT,
            URL TEXT,
            idGenero TEXT REFERENCES Generos(idGenero)
        );`, 
        (err) => {
            if (err) { 
                console.error("Erro ao criar tabela:", err.message);
            }
            else {
                console.log("Tabela Musicas criada com sucesso!");
            }
        });
}

function addMusica(idMusica, nome, artista, URL, idGenero) { // @@Genero -> ele pegaria a URL da musica e adicionaria na tabela
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO Musicas (idMusica, nome, artista, URL, idGenero) VALUES (?, ?, ?, ?, ?)`;
        db.run(query, [idMusica, nome, artista, URL, idGenero], function(err) {
            if (err) {
                return reject(err);
            }
            resolve(`Música ${nome} adicionada com sucesso!`);
        });
    });
}

function removeMusica(idMusica) {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM Musicas WHERE idMusica = ?`;
        db.run(query, [idMusica], function(err) {
            if (err) {
                return reject(err);
            }
            resolve(`Música ${idMusica} removida com sucesso!`);
        });
    });
}

function consultarMusica(idMusica) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM Musicas WHERE idMusica = ?`;
        db.get(query, [idMusica], (err, row) => {
            if (err) {
                return reject(err);
            }
            resolve(row);
        });
    });
}

export{createTableMusicas, addMusica, removeMusica, consultarMusica};