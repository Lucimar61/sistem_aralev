import { API_URL } from './api.js';

document.getElementById("cad_produtos").addEventListener("click", async function (event) {
    // evita o carregamento da página
    event.preventDefault();

    const token = getToken(); // Recupera o token JWT
    if(!token) return; // Se não houver token, encerra

    // Captura os valores do formulário
    const nome_produto = document.querySelector("input[name='nome_produto']").value.trim();
    const tag_produto = document.querySelector("input[name='tag_produto']").value.trim();
    const desc_produto = document.querySelector("input[name='desc_produto']").value.trim();
    const medicao_produto = document.querySelector("select[name='medicao']").value.trim();
    const valor_produto = document.querySelector("input[name='valor_unitario']").value.trim();
    const preco_custo = document.querySelector("input[name='preco_custo']").value.trim();
    const quantidade = document.querySelector("input[name='quantidade']").value.trim();

    // Validação simples
    if(!nome_produto || !desc_produto || !tag_produto || !medicao_produto || !valor_produto || !preco_custo || !quantidade) {
    alert("Por favor, preencha todos os campos.");
    return;
    }

    // Envia o novo produto para o backend via POST
    try {
        const response = await fetch(`${API_URL}/itens`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": token
            },
            body: JSON.stringify({
                nome: nome_produto,
                tag: tag_produto,
                descricao: desc_produto,
                medida: medicao_produto,
                precoVenda: parseFloat(valor_produto),
                precoCusto: parseFloat(preco_custo),
                quantidade: parseInt(quantidade)
            })
        });

        const data = await response.json();
        console.log("Resposta do servidor:", data);

        if(response.ok) {
            if(data?.sucesso) {
                alert("Produto cadastrado com sucesso!");
                document.getElementById("popUp").style.display = "none";
            } else {
                alert(data?.mensagem || "Erro ao cadastrar o produto.");
            }
         }else {
            alert(data?.mensagem || "Erro ao cadastrar o produto.");
        }
    } catch (error) {
        console.error("Erro ao enviar:", error);
        alert("Falha na conexão com o servidor.");
    }
})  

document.getElementById("close_popUp").addEventListener("click", function () {
    document.getElementById("popUp").style.display ="none";
});

document.addEventListener("DOMContentLoaded", () => {
    fetchProdutos();
});

function getToken() {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
        alert("Sessão expirada. Faça login novamente.");
    }
    return token;
}

