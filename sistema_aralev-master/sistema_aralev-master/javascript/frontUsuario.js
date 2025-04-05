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
                "x-access-token": token // 👈 CORREÇÃO: o back-end espera isso
            },
            body: JSON.stringify({
                nome: nome_usuario,        // 👈 nomes alinhados com o back-end
                login,
                senha,
                nivelAcesso: nivel_acesso
            })
        });

        if (!response.ok) {
            throw new Error("Erro na resposta do servidor");
        }

        const data = await response.json();

        if (data?.sucesso) {
            alert("Usuário cadastrado com sucesso!");
            document.getElementById("popUp").style.display = "none";
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