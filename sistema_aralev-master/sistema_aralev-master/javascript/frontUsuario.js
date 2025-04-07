import { API_URL } from './api.js';
    
    document.getElementById("open_popUp").addEventListener("click", async function (event) {
        event.preventDefault();
        
        const token = localStorage.getItem("jwtToken");
        console.log("Token JWT:", token); // 👈 veja se não é null

        const nome_usuario = document.querySelector("input[name='nome_usuario']").value;
        const login = document.querySelector("input[name='login']").value;
        const senha = document.querySelector("input[name='senha']").value;
        const nivel_acesso = document.querySelector("select[name='medicao']").value;

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
        
            const data = await response.json(); // tentar ler a resposta, mesmo com erro
            
            console.log("Resposta do servidor:", data);

            if (response.ok) {
                if (data?.sucesso) {
                    alert("Usuário cadastrado com sucesso!");
                    document.getElementById("popUp").style.display = "none";
                    location.reload();
                } else {
                    alert(data?.mensagem || "Erro ao cadastrar usuário 2.");
                }
            } else {
                // resposta com erro tratado (ex: login duplicado)
                alert(data?.mensagem || "Erro ao cadastrar usuário 1.");
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

    function fetchUsuarios() {
        const token = localStorage.getItem("jwtToken");
        console.log("Token JWT:", token); // 👈 veja se não é null
    
        fetch(`${API_URL}/usuarios`, {
            headers: {
                "x-access-token": token
            }
        })
        .then(response => response.json())
        .then(usuarios => {
            const tabela = document.getElementById("tabela-usuarios");
            tabela.innerHTML = ""; // limpa a tabela
    
            usuarios.forEach((usuario, index) => {
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
        const token = localStorage.getItem("jwtToken");
    
        console.log("ID do usuário a excluir:", id);
        console.log("Token usado:", token);
    
        if (confirm("Tem certeza que deseja excluir este usuário?")) {
            fetch(`${API_URL}/usuarios/${id}`, {
                method: "DELETE",
                headers: {
                    "x-access-token": token
                }
            })
            .then(response => {
                console.log("Status da resposta:", response.status);
                return response.json().then(data => {
                    console.log("Resposta do servidor:", data);
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
    
        // Ativa edição nas colunas: nome, login, senha (a senha será editável diretamente)
        for (let i = 1; i <= 3; i++) {
            linha.children[i].setAttribute("contenteditable", "true");
        }
    
        linha.children[3].textContent = ""; // limpa os "*****" pra digitar nova senha
    
        linha.querySelector(".editar").style.display = "none";
        linha.querySelector(".salvar").style.display = "inline-block";
    }
    window.editarLinha = editarLinha;

    function salvarLinha(botao) {
        const linha = botao.closest("tr");
        const id = linha.children[0].textContent;
        const nome = linha.children[1].textContent.trim();
        const login = linha.children[2].textContent.trim();
        const senha = linha.children[3].textContent.trim();
        const nivelTexto = linha.children[4].textContent.trim();
    
        const nivelMap = {
            "Administrador": 1,
            "Supervisor": 2,
            "Vendedor": 3
        };
        const nivel = nivelMap[nivelTexto] || 3;
    
        const token = localStorage.getItem("jwtToken");
    
        fetch(`${API_URL}/usuarios/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": token
            },
            body: JSON.stringify({
                nome: nome,
                login: login,
                senha: senha,
                nivelAcesso: nivel
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data?.sucesso) {
                alert("Usuário atualizado com sucesso.");
                linha.querySelector(".editar").style.display = "inline-block";
                linha.querySelector(".salvar").style.display = "none";
    
                // Desativa edição
                for (let i = 1; i <= 3; i++) {
                    linha.children[i].setAttribute("contenteditable", "false");
                }
    
                linha.children[3].textContent = "*****";
            } else {
                alert(data?.mensagem || "Erro ao atualizar usuário.");
            }
        })
        .catch(error => {
            console.error("Erro ao atualizar:", error);
            alert("Erro ao atualizar usuário.");
        });
    }
    window.salvarLinha = salvarLinha;

    
    
    