const express = require('express');
const cors = require('cors');
const meuAPP = express();
const { connectDB, pool } = require('./database');
const { router: loginRouter, verifyJWT } = require('./src/models/login');
const statusRouter = require('./src/models/status');  // Importa o router de status

require('dotenv').config();

const PORT = process.env.PORT || 8080;

meuAPP.use(cors()); // Adicionado para permitir requisições do frontend
meuAPP.use(express.json());
meuAPP.use(express.urlencoded({ extended: true }));

connectDB();

// Rota principal
meuAPP.get("/", (req, res) => {
  res.send("Olá mundo");
});

// Rota para buscar usuários
meuAPP.get("/usuarios", verifyJWT, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM tb_usuario");
    res.json(rows);
  } catch (err) {
    console.error("Erro ao buscar usuário:", err);
    res.status(500).send("Erro ao buscar usuário");
  }
});

// Rota para descrição da tabela
meuAPP.get("/desc", async (req, res) => {
  try {
    const [rows] = await pool.query("DESCRIBE tb_usuario;");
    res.json(rows);
  } catch (err) {
    console.error("Erro ao buscar usuário:", err);
    res.status(500).send("Erro ao buscar usuário");
  }
});

// Usando o router de login para a rota /login
meuAPP.use('/login', loginRouter); 


meuAPP.use('/logout', loginRouter); 

meuAPP.use(statusRouter); 

meuAPP.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} http://localhost:${PORT}/`);
});