document.addEventListener("DOMContentLoaded", function () {
    // Adiciona seus event listeners aqui
});

document.getElementById("cadastrar").addEventListener("click", async function () {
    const nome = document.querySelector("input[name='nome_usuario']").value;
    const login = document.querySelector("input[name='login']").value;
    const senha = document.querySelector("input[name='senha']").value;
    const nivelAcesso = document.querySelector("select[name='nivel_acesso']").value;

    // Envia a requisição POST para o backend
    try {
        const response = await fetch('http://localhost:8080/cad_usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome,
                login,
                senha,
                nivelAcesso
            })
        });

        const result = await response.json();
        
        // Verifica se o cadastro foi bem-sucedido
        if (response.ok) {
            alert(result.message);
            // Recarrega a página após o cadastro bem-sucedido
            window.location.reload();
        } else {
            alert('Erro ao cadastrar usuário: ' + result.message);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao cadastrar usuário.');
    }
});

// Função para atualizar a tabela de usuários
async function atualizarTabelaUsuarios() {
    try {
        const response = await fetch('http://localhost:8080/usuarios');
        if (!response.ok) {
            throw new Error('Falha ao carregar os dados dos usuários');
        }
        const usuarios = await response.json();

        // Limpa a tabela antes de adicionar os dados
        const tabelaUsuarios = document.getElementById("tabela-usuarios");
        tabelaUsuarios.innerHTML = ''; // Limpa a tabela

        // Adiciona os usuários à tabela
        usuarios.forEach(usuario => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${usuario.id}</td>
                <td>${usuario.nome}</td>
                <td>${usuario.login}</td>
                <td>${usuario.senha}</td>
                <td>${usuario.nivel_acesso}</td>
            `;
            tabelaUsuarios.appendChild(row);
        });
    } catch (error) {
        //console.error('Erro ao atualizar tabela:', error);
        //alert('Erro ao carregar a tabela de usuários.');
    }
}

// Chama a função para preencher a tabela de usuários na carga inicial
atualizarTabelaUsuarios();
