document.getElementById("open_popUp").addEventListener("click", async function (event) {
    event.preventDefault(); // Evita o envio tradicional do formulário

    // Coleta os dados do formulário
    const nome_usuario = document.querySelector("input[name='nome_usuario']").value;
    const login = document.querySelector("input[name='login']").value;
    const senha = document.querySelector("input[name='senha']").value;
    const nivel_acesso = document.querySelector("select[name='medicao']").value;

    try {
        const response = await fetch("http://localhost:8080/usuarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome_usuario,
                login,
                senha,
                nivel_acesso
            })
        });

        const data = await response.json();

        if (data.sucesso) {
            alert("Usuário cadastrado com sucesso! ID: " + data.id);
            // Aqui você pode atualizar a tabela de usuários ou limpar o formulário
        } else {
            alert("Erro ao cadastrar usuário.");
        }
    } catch (error) {
        console.error("Erro ao enviar dados:", error);
        alert("Erro ao conectar com o servidor.");
    }
});
