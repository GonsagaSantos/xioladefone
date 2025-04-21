const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/musicbot.db', (err) => {
    if(err){
        throw new Error("Erro na conexão!!!");
    }
    
    console.log("Tudo certo!!");
});

const allowedGenres = [
    "Soul", "Funk", "Jazz", "Blues", "RnB",
    "HipHop", "Rap", "Pop", "Rock", "Punk",
    "Indie", "MPB", "Samba", "BossaNova", "Reggae",
    "Ska", "Trap", "Eletronica", "House", "Techno",
    "Lofi", "Psychedelic", "Experimental", "Instrumental", "Classica",
    "Metal", "Forro", "Sertanejo", "Pagode", "Drill",
    "Afrobeat", "Grime", "Kpop", "Jpop", "Vaporwave",
    "Chillwave", "Ambient", "NewAge"
]; //p evitar SQL Injection

function createTable(tabela) {
    db.run(`
        CREATE TABLE IF NOT EXISTS ${tabela} (
            idUsuario TEXT PRIMARY KEY,
            Soul TEXT, Funk TEXT, Jazz TEXT, Blues TEXT, RnB TEXT, 
            HipHop TEXT, Rap TEXT, Pop TEXT, Rock TEXT, Punk TEXT,
            Indie TEXT, MPB TEXT, Samba TEXT, BossaNova TEXT, Reggae TEXT,
            Ska TEXT, Trap TEXT, Eletronica TEXT, House TEXT, Techno TEXT,
            Lofi TEXT, Psychedelic TEXT, Experimental TEXT, Instrumental TEXT,
            Classica TEXT, Metal TEXT, Forro TEXT, Sertanejo TEXT, Pagode TEXT,
            Drill TEXT, Afrobeat TEXT, Grime TEXT, Kpop TEXT, Jpop TEXT,
            Vaporwave TEXT, Chillwave TEXT, Ambient TEXT, NewAge TEXT
        );
    `, (err) => {
        if (err) { 
            console.error("Erro ao criar tabela:", err.message);
        }
        else {
            console.log("Tabela criada com sucesso!");
        }
    });
}

function addUsuario(nomeTabela, idUsuario, genero) {
    return new Promise((resolve, reject) => {
        // Verifique se o usuário já existe na tabela
        const stmt = db.prepare(`SELECT 1 FROM ${nomeTabela} WHERE idUsuario = ?`);
        stmt.get(idUsuario, (err, row) => {
            if (err) return reject(err);

            // Se a coluna de gênero não existe, adicione-a
            if (!row) {
                // Se o usuário não existe, insira na tabela
                const insertStmt = db.prepare(`INSERT INTO ${nomeTabela}(idUsuario) VALUES (?)`);
                insertStmt.run(idUsuario, (insertErr) => {
                    if (insertErr) return reject(insertErr);
                });
            }

            // // Verifique se o gênero está nos gêneros permitidos
            // if (allowedGenres.includes(genero)) {
            //     // Adicionar a coluna de gênero se não existir
            //     const alterTableStmt = db.prepare(`ALTER TABLE ${nomeTabela} ADD ${genero} TEXT`);
            //     alterTableStmt.run((alterErr) => {
            //         if (alterErr && alterErr.code !== 'SQLITE_ERROR') return reject(alterErr); // Verifica se não é um erro relacionado à tentativa de adicionar uma coluna já existente
            //     });

            //     // Se o gênero for válido, adicione ou atualize o valor correspondente ao usuário
            //     const updateStmt = db.prepare(`UPDATE ${nomeTabela} SET ${genero} = ? WHERE idUsuario = ?`);
            //     updateStmt.run("1", idUsuario, (updateErr) => {
            //         if (updateErr) return reject(updateErr);
            //         resolve();
            //     });
            // } else {
            //     reject(new Error("Este gênero musical não existe!"));
            // }
        });
    });
}

function marcarPessoas(nomeTabela, genero, groupID) {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare(`SELECT idUsuario FROM ${nomeTabela} WHERE ${genero} = ?`);
        stmt.all('1', (err, rows) => {
            if(err) { return reject(err); }
            
            if()

            const usuarios = rows.map(row => row.idUsuario.trim());
            const usuariosComC = usuarios.map(id => `${id}@c.us`);
            resolve({ usuarios, usuariosComC });
        });
    });
};


function removerPessoas(nomeTabela, idUsuario, genero) {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare(`UPDATE ${nomeTabela} SET ${genero} = '0' WHERE idUsuario = ?`);
        stmt.run(idUsuario.trim(), function(err) {
            if(err) return reject(err);

            if(this.changes === 0) {
                resolve(`Você não era marcado em ${genero}`);
            }
            else {
                resolve(`Você não será mais marcado!!`);
            }
        }); 
    });
}


function consultaTabela(nomeTabela) {
    return new Promise((resolve, reject) => {
        db.all(`PRAGMA table_info(${nomeTabela})`, (err, rows) => {
            if (err) return reject(err);
            const generos = rows
                .map(row => row.name)
                .filter(name => name !== 'idUsuario');
            resolve(generos);
        });
    });
}

function consultarGenerosMarcados(nomeTabela, idUsuario) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM ${nomeTabela} WHERE idUsuario = ?`, [idUsuario], (err, row) => {
            if (err) return reject(err);
            if (!row) return resolve([]);

            const generosMarcados = Object.entries(row)
                .filter(([chave, valor]) => chave !== 'idUsuario' && valor === '1')
                .map(([chave]) => chave);

            resolve(generosMarcados);
        });
    });
}

module.exports = { createTable, addUsuario, removerPessoas, consultaTabela, marcarPessoas, consultarGenerosMarcados };