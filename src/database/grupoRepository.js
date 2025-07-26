import dbPromise from './db/connection.js';

const db = await dbPromise; 

async function createTableGrupos() {
    return new Promise((resolve, reject) => {
        db.run(`
            CREATE TABLE IF NOT EXISTS Grupos (
                idGrupo TEXT PRIMARY KEY,
                nome TEXT
            );`, (err) => {
                if (err) {
                    console.error("Erro ao criar tabela:", err.message);
                    reject(err);
                } else {
                    console.log("Tabela Grupos criada com sucesso!");
                    resolve();
                }
            });
    });
}

async function addGrupo(idGrupo, nome) {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO Grupos (idGrupo, nome) VALUES (?, ?)`;
        db.run(query, [idGrupo, nome], function(err) {
            if (err) {
                return reject(err);
            }
            resolve(`Grupo ${nome} adicionado com sucesso!`);
        });
    });
}

async function consultarGrupo(idGrupo) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM Grupos WHERE idGrupo = ?`;
        db.get(query, [idGrupo], (err, row) => {
            if (err) {
                return reject(err);
            }
            console.log("Grupo consultado:", row);
            resolve(row);
        });
    });
}

export{createTableGrupos, addGrupo, consultarGrupo};