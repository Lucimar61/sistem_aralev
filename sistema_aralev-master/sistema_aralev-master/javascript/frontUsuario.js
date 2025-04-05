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
                nome: nome_usuario,
                login,
                senha,
                nivelAcesso: nivel_acesso
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