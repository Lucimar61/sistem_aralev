const { pool } = require('../../database');
const { hashPassword } = require('./encrypt'); // Corrigido aqui

class Usuario {
    constructor(idUsuario, nome, login, senha, nivelAcesso) {
        this.idUsuario = idUsuario;
        this.nome = nome;
        this.login = login;
        this.senha = senha;
        this.nivelAcesso = nivelAcesso;
    }

    static validarLoginExistente(login, listaUsuarios) {
        const loginExistente = listaUsuarios.some(usuario => usuario.login === login);
        if (loginExistente) {
            this.exibirAlerta(`O login "${login}" já está em uso. Por favor, escolha outro login.`);
        }
        return loginExistente;
    }

    static exibirAlerta(mensagem) {
        console.warn('ALERTA:', mensagem);
    }

    async criarUsuario(nome, login, senha, nivelAcesso) {
        try {
            // Verifica se o login já existe no banco de dados
            const [rows] = await pool.execute('SELECT * FROM tb_usuario WHERE LOGIN = ?', [login]);
            if (rows.length > 0) {
                console.log('ALERTA: O login já está em uso.');
                return;
            }

            // Gera o hash da senha usando a função hashPassword do encrypt.js
            const { salt, hash } = hashPassword(senha);

            // Insere o novo usuário no banco de dados com a senha criptografada
            const query = 'INSERT INTO tb_usuario (NOME, LOGIN, SENHA, SALT, NIVEL_ACESSO) VALUES (?, ?, ?, ?, ?)';
            const [results] = await pool.execute(query, [nome, login, hash, salt, nivelAcesso]);
            console.log('Usuário registrado com sucesso! ID:', results.insertId);
        } catch (err) {
            console.error('Erro ao criar usuário:', err);
        }
    }
    

    atualizarUsuario(id, nome, login, senha, nivelAcesso) {
        return new Promise((resolve, reject) => {
            if (!id) {
                const erro = new Error('ID do usuário não fornecido');
                console.error(erro.message);
                return reject(erro);
            }
    
            const query = 'UPDATE tb_usuario SET nome = ?, login = ?, senha = ?, nivel_acesso = ? WHERE id = ?';
            
            connection.query(query, [nome, login, senha, nivelAcesso, id], (err, results) => {
                if (err) {
                    console.error('Erro ao atualizar usuário:', err);
                    return reject(err);
                }
                
                if (results.affectedRows === 0) {
                    const msg = `Nenhum usuário encontrado com o ID ${id}`;
                    console.log(msg);
                    return resolve({ success: false, message: msg });
                }
                
                console.log('Usuário atualizado com sucesso!');
                resolve({ success: true, affectedRows: results.affectedRows });
            });
        });
    }

    deletarUsuario(id) {
        return new Promise((resolve, reject) => {
            if (!id) {
                const erro = new Error('ID do usuário não fornecido para deleção');
                console.error(erro.message);
                return reject(erro);
            }
    
            const query = 'DELETE FROM tb_usuario WHERE id = ?';
            
            connection.query(query, [id], (err, results) => {
                if (err) {
                    console.error('Erro ao deletar usuário:', err);
                    return reject(err);
                }
                
                if (results.affectedRows === 0) {
                    const msg = `Nenhum usuário encontrado com o ID ${id}`;
                    console.log(msg);
                    return resolve({ success: false, message: msg });
                }
                
                console.log('Usuário deletado com sucesso!');
                resolve({ success: true, affectedRows: results.affectedRows });
            });
        });
    }

}

module.exports = Usuario;
