
// Função para adicionar eventos ao botão da sidebar
function adicionarEventosSidebar() {
    // Deixando o menu sidebar dinâmico
    document.getElementById('open_btn').addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('open-sidebar');
    });
}

// Chama a função ao carregar a página
//document.addEventListener("DOMContentLoaded", destacarPaginaAtiva);

// Executa a função após carregar a sidebar
document.addEventListener("DOMContentLoaded", destacarPaginaAtual);

// Exibindo pop up na tela de cadastro de produtos
function abrirPopUp() {
    document.getElementById("popUp").style.display = "block";
}

function fecharPopUp() {
    document.getElementById("popUp").style.display = "none";
}

// Fechar ao clicar fora do modal
window.onclick = function(event) {
    let modal = document.getElementById("popUp");
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// Destacando linhas selecionadas na tabela pedidos
// O código só será executado depois que toda a estrutura HTML estiver carregada no navegador.
// Isso garante que os elementos da página estejam acessíveis pelo JavaScript
document.addEventListener("DOMContentLoaded", function () {

    // selecionamos todos os checkboxes da página e armazenamos em checkboxes.
    const checkboxes = document.querySelectorAll(".checkbox");
    // Adicionamos um ouvinte de evento change no document. 
    // Isso é chamado quando qualquer checkbox da página for alterado.
    document.addEventListener("change", function(event) {
        // captura o elemento específico que foi alterado.
        const target = event.target;

        // target.matches(".checkbox"): Verifica se o elemento alterado é um checkbox.
        // target.id !== "selecionar-todos": Garante que o evento só afete os checkboxes
        // das linhas da tabela, ignorando o checkbox "Selecionar Todos".
        if (target.matches(".checkbox") && target.id !== "selecionar-todos") {

            // Encontra a <tr> (linha da tabela) mais próxima do checkbox clicado.
            let linha = target.closest("tr");

            // Chama a função linhaHasData() para verificar se a linha contém informações válidas.
            // Se a linha tem dados, a classe selecionado é adicionada ou removida,
            // dependendo do estado do checkbox (target.checked).
            if (linhaHasData(linha)) {
                linha.classList.toggle("selecionado", target.checked);
            } else {
                // Se a linha estiver vazia, o checkbox é imediatamente desmarcado 
                // para evitar seleção de linhas vazias.
                target.checked = false;
            }

            // Após qualquer mudança, chamamos atualizarSelecionarTodos() para verificar
            // se todos os checkboxes das linhas preenchidas estão marcados e atualizar 
            //o checkbox "Selecionar Todos" corretamente.
            atualizarSelecionarTodos();
        }
    });

    // Selecionar Todos (Apenas Linhas Preenchidas)
    const selecionarTodos = document.getElementById("selecionar-todos");
    selecionarTodos.addEventListener("change", function () {
        // recebe true se o usuário marcou "Selecionar Todos", ou false se desmarcou.
        const isChecked = this.checked;
        // Percorremos todos os checkboxes da tabela.
        // Para cada um, encontramos a linha correspondente (linha.closest("tr")).
        // Se a linha tiver dados (linhaHasData(linha)):
        // O checkbox da linha é marcado/desmarcado com isChecked.
        // A classe selecionado é adicionada/removida para destacar visualmente.
        checkboxes.forEach(checkbox => {
            let linha = checkbox.closest("tr");

            if (linhaHasData(linha)) {
                checkbox.checked = isChecked;
                linha.classList.toggle("selecionado", isChecked);
            }
        });
    });

    // Função para verificar se uma linha tem dados preenchidos
    function linhaHasData(linha) {
        // Seleciona todas as células <td> da linha, exceto a do checkbox (td:not(.checkbox-check)).
        const celulas = linha.querySelectorAll("td:not(.checkbox-check)"); // Ignora o checkbox
        // Usa .some() para verificar se pelo menos uma célula tem texto diferente de vazio ("").
        return Array.from(celulas).some(td => td.textContent.trim() !== ""); // Retorna true se houver conteúdo
    }

    // Atualizar "Selecionar Todos" com base na seleção manual
    function atualizarSelecionarTodos() {
        // Converte checkboxes em um array (Array.from(checkboxes)).
        // Usa .filter() para manter apenas os checkboxes que:
        // Estão marcados (checkbox.checked).
        // Pertencem a uma linha preenchida (linhaHasData(checkbox.closest("tr"))).
        const checkboxesMarcados = Array.from(checkboxes).filter(checkbox => checkbox.checked && linhaHasData(checkbox.closest("tr")));
        // Se o número de checkboxes marcados for igual ao número de linhas na tabela (tbody tr), significa que todas as linhas preenchidas
        // estão selecionadas, então "Selecionar Todos" deve ficar marcado.
        // Caso contrário, ele fica desmarcado.
        const linhasPreenchidas = Array.from(document.querySelectorAll("tbody tr")).filter(linhaHasData);
        selecionarTodos.checked = checkboxesMarcados.length === linhasPreenchidas.length;
        //selecionarTodos.checked = checkboxesMarcados.length === document.querySelectorAll("tbody tr").length;
    }
});

// Adicionar a função de filtragem no JavaScript
document.addEventListener("DOMContentLoaded", function () {
    const inputFiltro = document.getElementById("buscar_pedidos"); // Campo de filtro
    const selectColuna = document.getElementById("coluna-filtro"); // Dropdown para escolher a coluna
    const tabelaPedidos = document.getElementById("tabela-pedidos"); // Tabela onde as linhas são geradas dinamicamente

    // Mapeamento dos índices reais da tabela
    const indiceColunas = {
        "nome": 2, // Nome está na 3ª coluna (índice 2)
        "cpf_cnpj": 3, // cpf_cnpj está na 4ª coluna (índice 3)
        "UF": 7, // UF está na 5ª coluna (índice 7)
        "cidade": 8 // cidade está na 6ª coluna (índice 8)
    };

    inputFiltro.addEventListener("input", function () {
        // Obtém o texto digitado e converte para minúsculas
        const termo = inputFiltro.value.toLowerCase().trim();
        const colunaSelecionada = selectColuna.value; // Nome da coluna no mapeamento
        const colunaIndex = indiceColunas[colunaSelecionada]; // Índice da coluna selecionada

        // Pega todas as linhas da tabela
        const linhas = tabelaPedidos.querySelectorAll("tr");

        linhas.forEach(linha => {

            // Pega todo o texto da linha
            //const textoLinha = linha.textContent.toLowerCase();
            const celulas = linha.querySelectorAll("td"); // Pega todas as células da linha
            const checkbox = linha.querySelector(".checkbox"); // Verifica se há checkbox na linha
            
            if (colunaIndex !== undefined && celulas[colunaIndex]) {
                const textoCelula = celulas[colunaIndex].textContent.toLowerCase();

                // Se o termo de busca estiver presente no texto da célula, exibe a linha
                if (textoCelula.includes(termo)) {
                    linha.style.display = "";
                    if (checkbox) checkbox.disabled = false; // Garante que o checkbox não fique desabilitado
                } else {
                    linha.style.display = "none";
                    if (checkbox) checkbox.disabled = true; // Desabilita apenas visualmente, se necessário
                }
            }
        });
    });
});


// Recuperação de senha
document.addEventListener("DOMContentLoaded", function() {
    const linkRecuperacao = document.querySelector(".esqueceu-senha a");
    const formRecuperacao = document.getElementById("form-recuperacao");
    const formLogin = document.getElementById("loginForm");
    const btnCancelar = document.querySelector("#form-recuperacao button[type='button']");
    
    linkRecuperacao.addEventListener("click", function(event) {
        event.preventDefault();
        formLogin.style.display = "none";
        formRecuperacao.style.display = "block";
    });
    
    btnCancelar.addEventListener("click", function() {
        formRecuperacao.style.display = "none";
        formLogin.style.display = "block";
    });
});

// Desconecta o usuário e retorna para a tela de login
document.getElementById("logout_btn").addEventListener("click", function () {
    if (confirm("Tem certeza que deseja sair?")) {
        localStorage.clear(); // Limpa dados do usuário (se necessário)
        window.location.href = "index.html"; // Redireciona para a tela de login
    }
});

// Adicionando o evento click no botão para adicionar novo produto
// =================================================================
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".add_produto").addEventListener("click", function () {
        adicionarProduto();
    });
});

function adicionarProduto() {
    let produtosContainer = document.getElementById("produtos-container");

    let novoProduto = document.createElement("div");
    novoProduto.classList.add("info-produtos");

    novoProduto.innerHTML = `
        <div class="campo-cad">
            <label>Produto</label>
            <select name="nome_produto[]" required>
                <option value="telha">Telha</option>
                <option value="tijolo">Tijolo</option>
                <option value="ferragem">Ferragem</option>
            </select>
        </div>
        <div class="campo-cad">
            <label>Quantidade</label>
            <input type="number" name="quantidade_produto[]" placeholder="Ex.: 10 UN" required>
        </div>
        <div class="campo-cad">
            <label>Desconto</label>
            <input type="text" name="desconto[]" placeholder="Ex.: R$ 5.00">
        </div>
        <div class="campo-cad">
            <label>Subtotal</label>
            <input type="text" name="subtotal[]" placeholder="Ex.: R$ 10.00">
        </div>
        <div class="container_novo_produto">
            <button class="remove_produto" type="button">
                <img src="assets/excluir.png" alt="Remover produto">
            </button>
        </div>
    `;

    produtosContainer.appendChild(novoProduto);

    // Adiciona evento para remover o produto
    novoProduto.querySelector(".remove_produto").addEventListener("click", function () {
        produtosContainer.removeChild(novoProduto);
    });
}

/* PopUp de confirmações */
// =========================================================================
document.addEventListener("DOMContentLoaded", function () {
    const popUp = document.getElementById("popUp");
    const btnSalvar = document.querySelector(".btn_salvar"); // Botão principal
    const btnFechar = document.getElementById("close_popUp");
    const btnConfirmar = document.getElementById("open_popUp"); // Botão de confirmação no pop-up

    // Função para abrir o pop-up
    function abrirPopUp(event) {
        event.preventDefault(); // Evita o envio do formulário antes da confirmação
        popUp.style.display = "flex";
    }

    // Função para fechar o pop-up
    function fecharPopUp() {
        popUp.style.display = "none";
    }

    // Evento para abrir o pop-up ao clicar no botão "Salvar"
    btnSalvar.addEventListener("click", abrirPopUp);

    // Evento para fechar o pop-up ao clicar no botão "Cancelar"
    btnFechar.addEventListener("click", fecharPopUp);

    // Evento para confirmar o cadastro e enviar o formulário
    btnConfirmar.addEventListener("click", function () {
        document.querySelector("form").submit();
    });
});


