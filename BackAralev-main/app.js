const express = require('express');
const cors = require('cors');
const meuAPP = express();
const { connectDB, pool } = require('./database');
const { router: loginRouter, verifyJWT } = require('./src/models/login');
const statusRouter = require('./src/models/status');  // Importa o router de status
const { registerUser } = require('./src/models/encrypt');
const path = require('path');

require('dotenv').config();

const PORT = process.env.PORT || 8080;

meuAPP.use(cors()); // Adicionado para permitir requisições do frontend
meuAPP.use(express.json());
meuAPP.use(express.urlencoded({ extended: true }));

connectDB();

meuAPP.use('/sistema', verifyJWT, express.static(path.join(__dirname, 'sistema_aralev-master')));

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

meuAPP.post('/cad_usuario', async (req, res) => {
  const { nome, login, senha, nivelAcesso } = req.body;

  // Validação simples dos dados
  if (!nome || !login || !senha || !nivelAcesso) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    // Chama a função de cadastro do usuário
    await registerUser(nome, login, senha, nivelAcesso);
    res.status(200).json({ message: 'Usuário registrado com sucesso!' });
  } catch (err) {
    console.error('Erro ao registrar usuário:', err);
    res.status(500).json({ message: 'Erro ao registrar usuário', error: err.message });
  }
});

meuAPP.get("/inicio", verifyJWT, (req, res) => {
  res.redirect("http://127.0.0.1:5500/sistema_aralev-master/inicio.html");
});

const { router: verifyTokenRouter } = require("./src/models/login");
meuAPP.use(verifyTokenRouter);


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