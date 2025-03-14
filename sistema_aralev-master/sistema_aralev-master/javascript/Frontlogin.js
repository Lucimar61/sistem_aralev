        document.addEventListener("DOMContentLoaded", function () {
            console.log("DOM completamente carregado.");

            // Seleciona o formulário de login
            const loginForm = document.getElementById("loginForm");
            if (loginForm) {
                loginForm.addEventListener("submit", async (event) => {
                    event.preventDefault();
                    
                    const login = document.querySelector("input[name='login']").value.trim();
                    const senha = document.querySelector("input[name='senha']").value.trim();

                    if (!login || !senha) {
                        alert("Por favor, preencha todos os campos.");
                        return;
                    }

                    try {
                        const response = await fetch("http://localhost:8080/login", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ login: login, senha: senha })
                        });

                        const data = await response.json();
                        console.log("Resposta da API:", data);

                        // Verifica se a resposta da API contém a chave 'message'
                        if (response.ok && data.message) {  
                            window.location.href = "inicio.html";
                        } else {
                            alert("Erro: " + (data.message || "Erro desconhecido"));  // Exibe erro se não houver mensagem
                        }
                    } catch (error) {
                        console.error("Erro na requisição:", error);
                        alert("Erro ao tentar fazer login. Tente novamente mais tarde.");
                    }
                });
            } else {
                console.error("Elemento #loginForm não encontrado. Verifique se o ID está correto.");
            }

        });

        async function checkServerStatus() {
            try {
                const response = await fetch("http://localhost:8080/status");
                const data = await response.json();
        
                document.getElementById("api-status").style.backgroundColor = data.api ? "green" : "red";
                document.getElementById("db-status").style.backgroundColor = data.db ? "green" : "red";
        
                console.log("Status atualizado:", data);
            } catch (error) {
                console.error("Erro ao verificar o status:", error);
                document.getElementById("api-status").style.backgroundColor = "red";
                document.getElementById("db-status").style.backgroundColor = "red";
            }
        }
        
        // Atualiza o status a cada 5 segundos
        setInterval(checkServerStatus, 5000);
        
        // Chama a função assim que a página carregar
        document.addEventListener("DOMContentLoaded", checkServerStatus);
        
        
