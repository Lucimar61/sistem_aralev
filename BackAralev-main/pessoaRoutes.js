const express = require('express');
const router = express.Router();
const Pessoa = require('../models/Pessoa');

// Rota para criar uma nova pessoa
router.post('/pessoas', async (req, res) => {
    try {
        const { nome, celular, cpfCnpj, rua, numero, bairro, cidade, uf } = req.body;
        
        const resultado = await Pessoa.criarPessoa(
            nome, 
            celular, 
            cpfCnpj, 
            rua, 
            numero, 
            bairro, 
            cidade, 
            uf
        );

        if (resultado.erro) {
            return res.status(400).json(resultado);
        }

        res.status(201).json(resultado);
    } catch (error) {
        console.error('Erro ao criar pessoa:', error);
        res.status(500).json({ 
            erro: 'Erro interno ao criar pessoa',
            detalhe: error.message 
        });
    }
});

// Rota para listar todas as pessoas
router.get('/pessoas', async (req, res) => {
    try {
        const pessoas = await Pessoa.listarPessoas();
        res.status(200).json(pessoas);
    } catch (error) {
        console.error('Erro ao listar pessoas:', error);
        res.status(500).json({ 
            erro: 'Erro interno ao listar pessoas',
            detalhe: error.message 
        });
    }
});

// Rota para buscar uma pessoa por ID
router.get('/pessoas/:id', async (req, res) => {
    try {
        const pessoa = await Pessoa.buscarPorId(req.params.id);
        
        if (!pessoa) {
            return res.status(404).json({ 
                erro: 'Pessoa não encontrada' 
            });
        }

        res.status(200).json(pessoa);
    } catch (error) {
        console.error('Erro ao buscar pessoa:', error);
        res.status(500).json({ 
            erro: 'Erro interno ao buscar pessoa',
            detalhe: error.message 
        });
    }
});

// Rota para atualizar uma pessoa
router.put('/pessoas/:id', async (req, res) => {
    try {
        const resultado = await Pessoa.atualizarPessoa(
            req.params.id, 
            req.body
        );

        if (!resultado.sucesso) {
            return res.status(404).json(resultado);
        }

        res.status(200).json(resultado);
    } catch (error) {
        console.error('Erro ao atualizar pessoa:', error);
        res.status(500).json({ 
            erro: 'Erro interno ao atualizar pessoa',
            detalhe: error.message 
        });
    }
});

// Rota para excluir uma pessoa
router.delete('/pessoas/:id', async (req, res) => {
    try {
        const resultado = await Pessoa.excluirPessoa(req.params.id);
        
        if (!resultado.sucesso) {
            return res.status(404).json(resultado);
        }

        res.status(200).json(resultado);
    } catch (error) {
        console.error('Erro ao excluir pessoa:', error);
        res.status(500).json({ 
            erro: 'Erro interno ao excluir pessoa',
            detalhe: error.message 
        });
    }
});

module.exports = router;