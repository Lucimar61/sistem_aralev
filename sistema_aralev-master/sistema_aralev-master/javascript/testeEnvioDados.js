import { API_URL } from "./api.js";

// Esta função assíncrona é responsável por capturar os dados do formulário e enviá-los ao back-end.
async function cadastrarUsuario(event) {

    // Impede que o formulário recarregue a página ao enviar os dados
    event.preventDefault();

    // Aqui, estamos selecionando os campos de entrada do formulário e armazenando seus valores.
    const nomeUsuario = document.querySelector("input[name='nome_usuario']").value;
    const login = document.querySelector("input[name='login']").value;
    const senha = document.querySelector("input[name='senha']").value;
    const nivelAcesso = document.querySelector("select[name='medicao']").value;

    // Criamos um objeto contendo os dados do usuário a serem enviados na requisição.
    const dadosUsuario = {
        nome: nomeUsuario,
        login: login,
        senha: senha,
        nivel_acesso: nivelAcesso
    };

    try {
        // Realizamos uma requisição HTTP do tipo POST para a API do back-end.
        const response = await fetch(`${API_URL}/api/usuarios`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosUsuario)
        });

        // Verificamos se a resposta do servidor foi bem-sucedida; caso contrário, lançamos um erro.
        if (!response.ok) {
            throw new Error("Erro ao cadastrar usuário");
        }

        // Se a requisição for bem-sucedida, convertemos a resposta em JSON.
        const resultado = await response.json();
        alert("Usuário cadastrado com sucesso!");
        console.log(resultado);
    } catch (error) {
        console.error("Erro:", error);
        alert("Falha ao cadastrar usuário. Tente novamente.");
    }
}

// Selecionamos o botão de salvar e adicionamos um evento para chamar a função de cadastro quando clicado.
const botaoSalvarUsuario = document.getElementById("open_popUp");
botaoSalvarUsuario.addEventListener("click", cadastrarUsuario);