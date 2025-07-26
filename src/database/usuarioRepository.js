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

async function addUsuario(idUsuario, idGrupo, nome) {
    try {

        const usuario = await consultarUsuario(idUsuario);
        if(usuario) {
            return `Usuário ${nome} já existe!`;
        }

        const query = `INSERT INTO Usuarios (idUsuario, idGrupo, nome) VALUES (?, ?, ?)`;
        await db.run(query, [idUsuario, idGrupo, nome]);
        return `Usuário ${nome} adicionado com sucesso!`;
    } catch (err) {
        console.error("Erro ao adicionar usuário:", err.message);
        throw err; 
    }
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

async function consultarUsuario(idUsuario) {
    try {
        const query = `SELECT * FROM Usuarios WHERE idUsuario = ?`;
        
        // O método .get() já retorna uma Promise com o resultado
        const usuario = await db.get(query, [idUsuario]);
        
        return usuario; // Retorna o usuário ou 'undefined'
    } catch (err) {
        console.error("Erro ao consultar o usuário:", err);
        throw err; // Lança o erro para quem chamou a função poder tratar
    }
}

async function addUsuarioGenero(idUsuario, idGenero) {
    try {
        const query = `INSERT INTO GenerosPessoa (idUsuario, idGenero) VALUES (?, ?)`;
        await db.run(query, [idUsuario, idGenero]);
        return `Gênero ${idGenero} adicionado para o usuário ${idUsuario}!`;
    } catch (err) {
        console.error("Erro ao adicionar gênero:", err.message);
        return `Erro na inserção de valores (Tabela Usuario - Genero)`
    }
}

export{createTableUsuarios, addUsuario, removerPessoas, addUsuarioGenero};