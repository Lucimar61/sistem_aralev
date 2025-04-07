import { API_URL } from './api.js';

document.getElementById("open_popUp").addEventListener("click", async function (event) {
    event.preventDefault();

    const token = getToken();
    if (!token) return;

    const nome_usuario = document.querySelector("input[name='nome_usuario']").value.trim();
    const login = document.querySelector("input[name='login']").value.trim();
    const senha = document.querySelector("input[name='senha']").value.trim();
    const nivel_acesso = document.querySelector("select[name='medicao']").value;

    if (!nome_usuario || !login || !senha || !nivel_acesso) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/usuarios`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": token
            },
            body: JSON.stringify({
                nome: nome_usuario,
                login: login,
                senha: senha,
                nivelAcesso: parseInt(nivel_acesso)
            })
        });

        const data = await response.json();
        console.log("Resposta do servidor:", data);

        if (response.ok) {
            if (data?.sucesso) {
                alert("Usuário cadastrado com sucesso!");
                document.getElementById("popUp").style.display = "none";
                fetchUsuarios(); // recarrega a tabela sem recarregar a página
            } else {
                alert(data?.mensagem || "Erro ao cadastrar usuário.");
            }
        } else {
            alert(data?.mensagem || "Erro ao cadastrar usuário.");
        }

    } catch (error) {
        console.error("Erro ao enviar:", error);
        alert("Falha na conexão com o servidor.");
    }
});

document.getElementById("close_popUp").addEventListener("click", function () {
    document.getElementById("popUp").style.display = "none";
});

document.addEventListener("DOMContentLoaded", () => {
    fetchUsuarios();
});

function getToken() {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
        alert("Sessão expirada. Faça login novamente.");
    }
    return token;
}

function fetchUsuarios() {
    const token = getToken();
    if (!token) return;

    fetch(`${API_URL}/usuarios`, {
        headers: {
            "x-access-token": token
        }
    })
    .then(response => response.json())
    .then(usuarios => {
        const tabela = document.getElementById("tabela-usuarios");
        tabela.innerHTML = "";

        usuarios.forEach(usuario => {
            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${usuario.ID_USUARIO_PK}</td>
                <td contenteditable="false">${usuario.NOME}</td>
                <td contenteditable="false">${usuario.LOGIN}</td>
                <td contenteditable="false" class="senha">*****</td>
                <td contenteditable="false">${nivelTexto(usuario.NIVEL_ACESSO)}</td>
                <td>
                    <button class="editar" onclick="editarLinha(this)"><i class="fa fa-edit"></i></button>
                    <button class="salvar" onclick="salvarLinha(this)" style="display:none;"><i class="fa fa-check"></i></button>
                    <button class="excluir" onclick="excluirLinha(this)"><i class="fa fa-trash"></i></button>
                </td>
            `;
            tabela.appendChild(linha);
        });
    })
    .catch(error => console.error("Erro ao buscar usuários:", error));
}

function nivelTexto(nivel) {
    switch (nivel) {
        case 1: return "Administrador";
        case 2: return "Supervisor";
        case 3: return "Vendedor";
        default: return "Desconhecido";
    }
}

function excluirLinha(botao) {
    const linha = botao.closest("tr");
    const id = linha.children[0].textContent;
    const token = getToken();
    if (!token) return;

    if (confirm("Tem certeza que deseja excluir este usuário?")) {
        fetch(`${API_URL}/usuarios/${id}`, {
            method: "DELETE",
            headers: {
                "x-access-token": token
            }
        })
        .then(response => {
            return response.json().then(data => {
                if (!response.ok) throw new Error(data?.mensagem || "Erro ao excluir usuário.");
                linha.remove();
            });
        })
        .catch(error => {
            console.error("Erro ao excluir:", error);
            alert("Erro ao excluir usuário.");
        });
    }
}
window.excluirLinha = excluirLinha;

function editarLinha(botao) {
    const linha = botao.closest("tr");

    for (let i = 1; i <= 3; i++) {
        linha.children[i].setAttribute("contenteditable", "true");
    }

    linha.children[3].textContent = "[Digite nova senha]";

    linha.querySelector(".editar").style.display = "none";
    linha.querySelector(".salvar").style.display = "inline-block";
}
window.editarLinha = editarLinha;

function salvarLinha(botao) {
    const linha = botao.closest("tr");
    const id = linha.children[0].textContent;
    const nome = linha.children[1].textContent.trim();
    const login = linha.children[2].textContent.trim();
    const senhaCampo = linha.children[3].textContent.trim();
    const token = getToken();
    if (!token) return;

    if (!nome || !login) {
        alert("Preencha todos os campos corretamente.");
        return;
    }

    const payload = { nome, login };

    // Envia a senha apenas se ela foi alterada
    if (senhaCampo && senhaCampo !== "*****" && senhaCampo !== "[Digite nova senha]") {
        payload.senha = senhaCampo;
    }

    fetch(`${API_URL}/usuarios/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        return response.json().then(data => {
            if (!response.ok) throw new Error(data?.mensagem || "Erro ao salvar usuário.");

            for (let i = 1; i <= 3; i++) {
                linha.children[i].setAttribute("contenteditable", "false");
            }

            linha.children[3].textContent = "*****";

            linha.querySelector(".editar").style.display = "inline-block";
            linha.querySelector(".salvar").style.display = "none";
            alert("Usuário atualizado com sucesso!");
        });
    })
    .catch(error => {
        console.error("Erro ao salvar:", error);
        alert(error.message || "Erro ao salvar alterações.");
    });
}
window.salvarLinha = salvarLinha;
    