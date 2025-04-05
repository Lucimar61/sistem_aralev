// Importa a URL base da API (ajusta isso no arquivo api.js)
import { API_URL } from "./api.js";

// =======================
// Função: Cadastrar usuário
// =======================
export async function cadastrarUsuario(event) {
    event.preventDefault(); // Impede o comportamento padrão de envio do formulário

    // Captura os valores dos campos do formulário
    const nomeUsuario = document.querySelector("input[name='nome_usuario']").value;
    const login = document.querySelector("input[name='login']").value;
    const senha = document.querySelector("input[name='senha']").value;
    const nivelAcesso = document.querySelector("select[name='medicao']").value;

    // Monta o objeto com os dados do usuário
    const dadosUsuario = {
        nome: nomeUsuario,
        login,
        senha,
        nivel_acesso: nivelAcesso
    };

    try {
        // Envia os dados via POST para o endpoint da API
        const response = await fetch(`${API_URL}/api/usuarios`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosUsuario)
        });

        // Se a resposta não for bem-sucedida, dispara um erro
        if (!response.ok) {
            throw new Error("Erro ao cadastrar usuário");
        }

        alert("Usuário cadastrado com sucesso!");

        // Limpa o formulário após cadastro
        document.querySelector("form.frm_cadUsuarios").reset();

        // Recarrega a tabela com os novos dados
        carregarUsuarios();
    } catch (error) {
        console.error("Erro:", error);
        alert("Falha ao cadastrar usuário. Tente novamente.");
    }
}

// =======================
// Função: Carregar todos os usuários da API
// =======================
export async function carregarUsuarios() {
    try {
        // Faz a requisição GET para buscar os usuários da API
        const response = await fetch(`${API_URL}/api/usuarios`);
        
        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) throw new Error("Erro ao carregar usuários");

        // Converte a resposta em JSON (array de usuários)
        const usuarios = await response.json();

        // Seleciona o <tbody> da tabela no HTML
        const tabela = document.getElementById("tabela-usuarios");

        // Garante que o <tbody> esteja limpo antes de adicionar novas linhas
        tabela.innerHTML = "";

        // Verifica se há usuários para exibir
        if (usuarios.length === 0) {
            // Se não houver nenhum usuário, mostra uma linha com mensagem
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.colSpan = 6;
            td.textContent = "Nenhum usuário cadastrado.";
            td.style.textAlign = "center";
            tr.appendChild(td);
            tabela.appendChild(tr);
            return;
        }

        // Percorre cada usuário retornado pela API
        usuarios.forEach(usuario => {
            // Cria uma nova linha da tabela (<tr>)
            const tr = document.createElement("tr");

            // Adiciona o atributo data-id com o ID real do usuário (útil para edição/exclusão)
            tr.setAttribute("data-id", usuario.id);

            // Preenche a linha com os dados do usuário
            tr.innerHTML = `
                <td>${usuario.id}</td>
                <td contenteditable="false">${usuario.nome}</td>
                <td contenteditable="false">${usuario.login}</td>
                <td contenteditable="false" class="senha" data-senha="${usuario.senha}">****</td>
                <td contenteditable="false">${usuario.nivel_acesso}</td>
                <td>
                    <button class="toggle-password" onclick="toggleSenha(this)"><i class="fa fa-eye"></i></button>
                    <button class="editar" onclick="editarLinha(this)"><i class="fa fa-edit"></i></button>
                    <button class="excluir" onclick="excluirLinha(this)"><i class="fa fa-trash"></i></button>
                </td>
            `;

            // Adiciona a linha à tabela
            tabela.appendChild(tr);
        });

        document.querySelectorAll(".toggle-password").forEach(botao => {
            botao.addEventListener("click", () => window.toggleSenha(botao));
        });

    } catch (error) {
        // Em caso de erro, exibe no console e alerta ao usuário
        console.error("Erro ao carregar usuários:", error);
        alert("Falha ao carregar usuários.");
    }
}

// =======================
// Função: Atualizar um usuário específico
// =======================
export async function atualizarUsuario(id, dadosAtualizados) {
    try {
        // Envia uma requisição PUT para atualizar os dados do usuário com o ID fornecido
        const response = await fetch(`${API_URL}/api/usuarios/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosAtualizados)
        });

        if (!response.ok) throw new Error("Erro ao atualizar usuário");

        alert("Usuário atualizado com sucesso!");
        carregarUsuarios(); // Atualiza a tabela após salvar as alterações
    } catch (error) {
        console.error("Erro:", error);
        alert("Falha ao atualizar usuário.");
    }
}

// =======================
// Função: Excluir usuário
// =======================
export async function excluirUsuario(id) {
    const confirmar = confirm("Tem certeza que deseja excluir este usuário?");
    if (!confirmar) return; // Cancela se o usuário desistir

    try {
        // Envia uma requisição DELETE para remover o usuário
        const response = await fetch(`${API_URL}/api/usuarios/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error("Erro ao excluir usuário");

        alert("Usuário excluído com sucesso!");
        carregarUsuarios(); // Atualiza a tabela após exclusão
    } catch (error) {
        console.error("Erro:", error);
        alert("Falha ao excluir usuário.");
    }
}

