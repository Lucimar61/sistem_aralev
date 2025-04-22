const express = require('express');
const router = express.Router();
const { pool } = require('./database');
const { verifyJWT } = require('./src/models/login');

// Rota para criar uma nova pessoa
// router.post('/', verifyJWT, async (req, res) => {
    router.post('/', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { nome, celular, cpfCnpj, rua, numero, bairro, cidade, uf } = req.body;
        
        const [result] = await connection.execute(
            `INSERT INTO tb_pessoa 
             (NOME, CELULAR, CPF_CNPJ, RUA, NUMERO, BAIRRO, CIDADE, UF)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [nome, celular, cpfCnpj, rua, numero, bairro, cidade, uf]
        );

        const novaPessoa = {
            id: result.insertId,
            nome,
            celular,
            cpfCnpj,
            endereco: { rua, numero, bairro, cidade, uf }
        };

        res.status(201).json({
            success: true,
            data: novaPessoa
        });
    } catch (error) {
        console.error('Erro ao criar pessoa:', error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: 'CPF/CNPJ já cadastrado'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Erro ao criar pessoa',
            error: error.message
        });
    } finally {
        connection.release();
    }
});

// Rota para listar todas as pessoas
// router.get('/', verifyJWT, async (req, res) => {
    router.get('/', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(
            'SELECT * FROM tb_pessoa ORDER BY NOME'
        );

        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Erro ao listar pessoas:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao listar pessoas',
            error: error.message
        });
    } finally {
        connection.release();
    }
});

// Rota para buscar uma pessoa por ID
// router.get('/:id', verifyJWT, async (req, res) => {
    router.get('/:id', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(
            'SELECT * FROM tb_pessoa WHERE ID_PESSOA_PK = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pessoa não encontrada'
            });
        }

        res.status(200).json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Erro ao buscar pessoa:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar pessoa',
            error: error.message
        });
    } finally {
        connection.release();
    }
});

// Rota para atualizar uma pessoa
// router.put('/:id', verifyJWT, async (req, res) => {
    router.put('/:id', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { nome, celular, cpfCnpj, rua, numero, bairro, cidade, uf } = req.body;
        
        const [result] = await connection.execute(
            `UPDATE tb_pessoa SET
                NOME = ?,
                CELULAR = ?,
                CPF_CNPJ = ?,
                RUA = ?,
                NUMERO = ?,
                BAIRRO = ?,
                CIDADE = ?,
                UF = ?
             WHERE ID_PESSOA_PK = ?`,
            [nome, celular, cpfCnpj, rua, numero, bairro, cidade, uf, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pessoa não encontrada'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Pessoa atualizada com sucesso'
        });
    } catch (error) {
        console.error('Erro ao atualizar pessoa:', error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: 'CPF/CNPJ já cadastrado para outra pessoa'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar pessoa',
            error: error.message
        });
    } finally {
        connection.release();
    }
});

// Rota para excluir uma pessoa
//router.delete('/:id', verifyJWT, async (req, res) => {
    router.delete('/:id', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(
            'DELETE FROM tb_pessoa WHERE ID_PESSOA_PK = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pessoa não encontrada'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Pessoa excluída com sucesso'
        });
    } catch (error) {
        console.error('Erro ao excluir pessoa:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao excluir pessoa',
            error: error.message
        });
    } finally {
        connection.release();
    }
});

module.exports = router;