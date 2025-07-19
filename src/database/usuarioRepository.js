import dbPromise from './db/connection.js';

const db = await dbPromise;

function createTableUsuarios() {
    db.run(`
        CREATE TABLE IF NOT EXISTS Usuarios (
            idUsuario TEXT PRIMARY KEY,
            idGrupo TEXT REFERENCES Grupos(idGrupo),
            nome TEXT
        );`, 
        (err) => {
            if (err) { 
                console.error("Erro ao criar tabela:", err.message);
            }
            else {
                console.log("Tabela criada com sucesso!");
            }
        });
}

function addUsuario(idUsuario, idGrupo, nome) {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO Usuarios (idUsuario, idGrupo, nome) VALUES (?, ?, ?)`;
        db.run(query, [idUsuario, idGrupo, nome], function(err) {
            if (err) {
                return reject(err);
            }
            resolve(`Usuário ${nome} adicionado com sucesso!`);
        });
    });
}

function removerPessoas(idUsuario) {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM Usuarios WHERE idUsuario = ?`;
        db.run(query, [idUsuario], function(err) {
            if (err) {
                return reject(err);
            }
            resolve(`Usuário ${idUsuario} removido com sucesso!`);
        });
    });
}

export{createTableUsuarios, addUsuario, removerPessoas};