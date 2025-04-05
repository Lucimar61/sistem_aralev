document.getElementById("open_popUp").addEventListener("click", async function (event) {
    event.preventDefault();
    
    const token = localStorage.getItem("jwtToken");
    console.log("Token JWT:", token); // 👈 veja se não é null

    const nome_usuario = document.querySelector("input[name='nome_usuario']").value;
    const login = document.querySelector("input[name='login']").value;
    const senha = document.querySelector("input[name='senha']").value;
    const nivel_acesso = document.querySelector("select[name='medicao']").value;

    try {
        const response = await fetch("http://localhost:8080/usuarios", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "x-access-token": token
    },
    body: JSON.stringify({
        NOME: nome_usuario,
        LOGIN: login,
        SENHA: senha,
        NIVEL_ACESSO: parseInt(nivel_acesso)
    })
});
    
        const data = await response.json(); // tentar ler a resposta, mesmo com erro
        
        console.log("Resposta do servidor:", data);

        if (response.ok) {
            if (data?.sucesso) {
                alert("Usuário cadastrado com sucesso!");
                document.getElementById("popUp").style.display = "none";
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
    fetch('http://localhost:8080/usuarios')
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
                    <td contenteditable="false" class="senha" data-senha="${usuario.SENHA}">****</td>
                    <td contenteditable="false">${nivelTexto(usuario.NIVEL_ACESSO)}</td>
                    <td>
                        <button class="toggle-password" onclick="toggleSenha(this)" data-tooltip="Mostrar senha"><i class="fa fa-eye"></i></button>
                        <button class="editar" onclick="editarLinha(this)"><i class="fa fa-edit"></i></button>
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
