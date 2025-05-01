const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/musicbot.db', (err) => {
    if(err){
        throw new Error("Erro na conexão!!!");
    }
    
    console.log("Tudo certo!!");
});

const allowedGenres =  db.prepare(`select name from pragma_table_info('GenresAndPeople') WHERE name <> 'idUsuario' AND name <> 'grupo'`);
allowedGenres.all( (err, cols) => {
    if (err) return reject(err);

    const genres = cols.map(col => col.name.trim());
    console.log(genres)
});

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

console.log(allowedGenres)

function addUsuario(nomeTabela, idUsuario, genero, groupId) {
    return new Promise((resolve, reject) => {
        const allowedGenres =  db.prepare(`select name from pragma_table_info('GenresAndPeople') WHERE name <> 'idUsuario' AND name <> 'grupo'`);
        allowedGenres.all( (err, cols) => {
            if (err) return reject(err);

            const genres = cols.map(col => col.name.trim());
            console.log(genres)
        
            if (!genres.includes(genero)) {
                const alterQuery = `ALTER TABLE ${nomeTabela} ADD COLUMN ${genero} VARCHAR(20)`;
                const updateGenreQuery = `UPDATE ${nomeTabela} SET ${genero} = ? WHERE idUsuario = ?`;
                const updateGroupQuery = `UPDATE ${nomeTabela} SET grupo = ? WHERE idUsuario = ?`;

                db.run(alterQuery, [], (err) => {
                    if (err) return reject(err);

                    db.run(updateGenreQuery, ['1', idUsuario], (err) => {
                        if (err) return reject(err);

                        db.run(updateGroupQuery, [groupId, idUsuario], (err) => {
                            if (err) return reject(err);

                            resolve("O estilo foi adicionado e você será marcado!");
                        });
                    });
                });
            } else {
                const updateGenreQuery = `UPDATE ${nomeTabela} SET ${genero} = ? WHERE idUsuario = ?`;
                const updateGroupQuery = `UPDATE ${nomeTabela} SET grupo = ? WHERE idUsuario = ?`;

                db.run(updateGenreQuery, ['1', idUsuario], (err) => {
                    if (err) return reject(err);

                    db.run(updateGroupQuery, [groupId, idUsuario], (err) => {
                        if (err) return reject(err);

                        resolve(`Agora você será marcado em ${genero}`);
                    });
                });
            }

        });  
    });
}


function marcarPessoas(nomeTabela, genero, groupID) {
    return new Promise((resolve, reject) => {
        const queryGenres =  db.prepare(`select name from pragma_table_info('${nomeTabela}') WHERE name <> 'idUsuario' AND name <> 'grupo'`);
        queryGenres.all( (err, cols) => {
            if (err) return reject(err);

            const genres = cols.map(col => col.name.trim());
            console.log(genres)

                if (!genres.includes(genero)) {
                    return reject(new Error('Inválido.'));
                }
        })


        const queryMarcacao = db.prepare(`SELECT idUsuario FROM ${nomeTabela} WHERE ${genero} = ? AND grupo = ?`);
        queryMarcacao.all(['1', groupID], (err, rows) => {
            if (err) return reject(err);

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
                .filter(name => name !== 'idUsuario')
                .filter(name => name !== 'grupo') //nao marcar a coluna 'grupo' no consulta tags
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