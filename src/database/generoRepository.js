import dbPromise from './db/connection.js';

const db = await dbPromise;

function createTableGeneros() {
    db.run(`
        CREATE TABLE IF NOT EXISTS Generos (
            idGenero INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT
            );`, (err) => {
                if (err) {
                    console.error("Erro ao criar tabela:", err.message);
                }
                else {
                    console.log("Tabela Generos criada com sucesso!");
                }
            })
}

async function addGenero(idGenero, nome) {
    try {
        const query = `INSERT INTO Generos (idGenero, nome) VALUES (?, ?)`;
        await db.run(query, [idGenero, nome]);
        return `Gênero ${nome} adicionado com sucesso!`;
    } catch (err) {
        console.error("Erro ao adicionar gênero:", err.message);
        return `Erro na inserção de valores (Tabela Generos)`;
    }
}

async function consultarGenero(idGenero) { // ??
    await new Promise((resolve, reject) => {
        const query = `SELECT * FROM Generos WHERE idGenero = ?`;
        db.get(query, [idGenero], (err, row) => {
            if (err) {
                return reject(err);
            }
            resolve(row);
        });
    });
}

async function consultarGeneroPorUsuario(idUsuario) { // !minhasmarcacoes
    return new Promise((resolve, reject) => {
        const query = `
            SELECT g.Nome FROM GenerosPessoa as gp
            INNER JOIN Generos AS g ON gp.idGenero = g.idGenero
            WHERE gp.idUsuario = ?`;
        db.all(query, [idUsuario], (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

async function ConsultarUsuarioPorGenero(idGenero) { // @@Genero
    return new Promise((resolve, reject) => {
        const query = `
            SELECT u.idUsuario FROM GenerosPessoa as gp
            INNER JOIN Usuarios AS u ON gp.idUsuario = u.idUsuario
            WHERE gp.idGenero = ?`;
        db.all(query, [idGenero], (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

export{createTableGeneros, addGenero, consultarGenero, consultarGeneroPorUsuario, ConsultarUsuarioPorGenero};