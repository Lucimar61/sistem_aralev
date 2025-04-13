document.addEventListener('DOMContentLoaded', function() {
    const tabelaEstoque = document.getElementById('tabela-estoqueProdutos');
    const btnBuscar = document.getElementById('btnBuscar');
    const btnRemover = document.getElementById('remover');
    
    // Token JWT (você precisará implementar o login antes)
    let token = localStorage.getItem('token');
    
    // Função para carregar itens do estoque
    async function carregarItens(filtro = '', valor = '') {
        try {
            let url = 'http://localhost:8080/api/itens';
            
            if (filtro && valor) {
                url += `?${filtro}=${encodeURIComponent(valor)}`;
            }
            
            const response = await fetch(url, {
                headers: {
                    'x-access-token': token
                }
            });
            
            if (!response.ok) {
                throw new Error('Erro ao carregar itens');
            }
            
            const itens = await response.json();
            preencherTabela(itens.data);
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao carregar itens do estoque');
        }
    }
    
    // Função para preencher a tabela com os itens
    function preencherTabela(itens) {
        tabelaEstoque.innerHTML = '';
        
        itens.forEach(item => {
            // Verificação completa do precoVenda
            const precoVenda = item.precoVenda !== undefined && item.precoVenda !== null 
                             ? Number(item.precoVenda) 
                             : 0;
            
            // Verificação da quantidade
            const quantidade = item.quantidade !== undefined && item.quantidade !== null
                            ? item.quantidade
                            : 0;
    
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="checkbox" class="checkbox-item" data-id="${item.idProduto}"></td>
                <td>${item.idProduto || '-'}</td>
                <td>${item.tag || '-'}</td>
                <td>${item.nome || '-'}</td>
                <td>${item.descricao || '-'}</td>
                <td>${item.medida || 'un'}</td>
                <td>R$ ${precoVenda.toFixed(2)}</td>
                <td>${quantidade}</td>
            `;
            tabelaEstoque.appendChild(row);
        });
    }
    
    // Função para buscar itens com filtro
    btnBuscar.addEventListener('click', function() {
        const filtro = document.getElementById('coluna-filtro').value;
        const valorBusca = document.getElementById('buscar_pedidos').value;
        carregarItens(filtro, valorBusca);
    });
    
    // Função para remover itens selecionados
    btnRemover.addEventListener('click', async function() {
        const checkboxes = document.querySelectorAll('.checkbox-item:checked');
        
        if (checkboxes.length === 0) {
            alert('Selecione pelo menos um item para remover');
            return;
        }
        
        if (!confirm(`Deseja realmente remover ${checkboxes.length} item(ns)?`)) {
            return;
        }
        
        try {
            const ids = Array.from(checkboxes).map(cb => cb.getAttribute('data-id'));
            
            for (const id of ids) {
                const response = await fetch(`http://localhost:8080/api/itens/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'x-access-token': token
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`Erro ao remover item ${id}`);
                }
            }
            
            alert('Itens removidos com sucesso!');
            carregarItens(); // Recarrega a tabela
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao remover itens');
        }
    });
    
    // Carrega os itens ao iniciar a página
    carregarItens();
    
    // Implemente essas funções para abrir o popup de edição/criação
    window.abrirPopUp = function(tipo) {
        // Implemente a lógica para abrir um modal/formulário
        // Você pode criar um formulário para editar/adicionar itens
        console.log(`Abrir popup para ${tipo}`);
    };
});