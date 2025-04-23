let produtosDisponiveis = [];
let clientesDisponiveis = [];

document.addEventListener('DOMContentLoaded', function() {
    inicializarMascaras();
    inicializarEventos();
    carregarClientes();
    carregarProdutos();
});

function inicializarMascaras() {
    $('input[name="num_celular"]').mask('(00) 0 0000-0000');
    $('input[name="cpf_ou_cnpj"]').mask('000.000.000-00', {reverse: true});
    $('input[name="CEP"]').mask('00000-000');
    $('input[name="UF"]').mask('AA');
    $('input[name^="desconto"], input[name^="subtotal"], input[name="total"]').mask('#.##0,00', {reverse: true});
}

function inicializarEventos() {
    document.querySelector('.add_produto').addEventListener('click', adicionarProduto);
    
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('quantidade-produto') || 
            e.target.classList.contains('desconto-produto') ||
            e.target.classList.contains('select-produto')) {
            calcularSubtotal(e.target);
        }
    });
}

async function carregarClientes() {
    try {
        const response = await fetch('http://localhost:8080/api/pessoas', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) throw new Error('Erro ao carregar clientes');
        
        const data = await response.json();
        clientesDisponiveis = data.data || [];
        configurarAutocompleteClientes();
    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        alert('Erro ao carregar clientes: ' + error.message);
    }
}

function configurarAutocompleteClientes() {
    const inputCliente = document.querySelector('input[name="nome_cliente"]');
    const datalist = document.getElementById('clientes-list');
    datalist.innerHTML = '';
    
    clientesDisponiveis.forEach(cliente => {
        const option = document.createElement('option');
        option.value = cliente.NOME; // Corrigido para usar NOME (maiúsculo)
        option.dataset.id = cliente.ID_PESSOA_PK;
        option.dataset.cpf = cliente.CPF_CNPJ;
        option.dataset.celular = cliente.CELULAR;
        option.dataset.endereco = `${cliente.RUA}, ${cliente.NUMERO}, ${cliente.CIDADE}/${cliente.UF}`;
        datalist.appendChild(option);
    });
    
    inputCliente.addEventListener('change', function() {
        const selectedOption = document.querySelector(`#clientes-list option[value="${this.value}"]`);
        if (selectedOption) {
            preencherDadosCliente(selectedOption);
        }
    });
}

function preencherDadosCliente(option) {
    document.querySelector('input[name="cpf_ou_cnpj"]').value = formatarDocumento(option.dataset.cpf);
    document.querySelector('input[name="num_celular"]').value = formatarTelefone(option.dataset.celular);
    
    const endereco = option.dataset.endereco.split(', ');
    document.querySelector('input[name="nome_rua"]').value = endereco[0];
    document.querySelector('input[name="numero_casa"]').value = endereco[1];
    document.querySelector('input[name="cidade"]').value = endereco[2].split('/')[0];
    document.querySelector('input[name="UF"]').value = endereco[2].split('/')[1];
}

async function carregarProdutos() {
    try {
        const response = await fetch('http://localhost:8080/api/itens', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) throw new Error('Erro ao carregar produtos');
        
        const data = await response.json();
        produtosDisponiveis = data.data || [];
        atualizarSelectProdutos();
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        alert('Erro ao carregar produtos: ' + error.message);
    }
}

function atualizarSelectProdutos() {
    const selects = document.querySelectorAll('.select-produto');
    
    selects.forEach(select => {
        select.innerHTML = '<option value="">Selecione um produto</option>';
        
        produtosDisponiveis.forEach(produto => {
            const option = document.createElement('option');
            option.value = produto.ID_PRODUTO_PK;
            option.textContent = `${produto.NOME} (${produto.precoVenda.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})})`;
            option.dataset.preco = produto.precoVenda;
            select.appendChild(option);
        });
    });
}

function adicionarProduto() {
    const container = document.getElementById('produtos-container');
    const novoProduto = document.createElement('div');
    novoProduto.className = 'info-produtos';
    novoProduto.innerHTML = `
        <div class="campo-cad">
            <label>Produto</label>
            <select name="produto[]" class="select-produto" required>
                <option value="">Selecione um produto</option>
                ${produtosDisponiveis.map(produto => `
                    <option value="${produto.ID_PRODUTO_PK}" data-preco="${produto.precoVenda}">
                        ${produto.NOME} (${produto.precoVenda.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})})
                    </option>
                `).join('')}
            </select>
        </div>
        <div class="campo-cad">
            <label>Quantidade</label>
            <input type="number" name="quantidade[]" placeholder="Ex.: 10 UN" min="1" class="quantidade-produto">
        </div>
        <div class="campo-cad">
            <label>Desconto</label>
            <input type="text" name="desconto[]" placeholder="Ex.: R$ 5.00,00" class="desconto-produto">
        </div>
        <div class="campo-cad">
            <label>Subtotal</label>
            <input type="text" name="subtotal[]" placeholder="Ex.: R$ 10.00,00" readonly class="subtotal-produto">
        </div>
        <div class="container_novo_produto">
            <button type="button" class="remover_produto" onclick="removerProduto(this)">
                <img src="assets/remover_produto.png" alt="Remover produto" />
            </button>
        </div>
    `;
    container.appendChild(novoProduto);
}

function removerProduto(botao) {
    botao.closest('.info-produtos').remove();
    calcularTotalPedido();
}

function calcularSubtotal(elemento) {
    const linha = elemento.closest('.info-produtos');
    const select = linha.querySelector('.select-produto');
    const quantidade = parseFloat(linha.querySelector('.quantidade-produto').value) || 0;
    const desconto = parseFloat(linha.querySelector('.desconto-produto').value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    const precoUnitario = select.value ? parseFloat(select.options[select.selectedIndex].dataset.preco) : 0;
    
    const subtotal = (quantidade * precoUnitario) - desconto;
    linha.querySelector('.subtotal-produto').value = subtotal.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
    
    calcularTotalPedido();
}

function calcularTotalPedido() {
    let total = 0;
    document.querySelectorAll('.subtotal-produto').forEach(input => {
        const valor = parseFloat(input.value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
        total += valor;
    });
    
    document.querySelector('input[name="total"]').value = total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function validarPedido() {
    const cliente = document.querySelector('input[name="nome_cliente"]').value;
    if (!cliente) {
        alert('Selecione um cliente');
        return;
    }

    let temProdutosValidos = false;
    document.querySelectorAll('.select-produto').forEach(select => {
        if (select.value) temProdutosValidos = true;
    });

    if (!temProdutosValidos) {
        alert('Adicione pelo menos um produto');
        return;
    }

    abrirPopUp();
}

function abrirPopUp() {
    document.getElementById('popUp').style.display = 'flex';
}

function fecharPopUp() {
    document.getElementById('popUp').style.display = 'none';
}

async function confirmarPedido() {
    try {
        await emitirPedido();
        fecharPopUp();
    } catch (error) {
        console.error('Erro ao confirmar pedido:', error);
    }
}

async function emitirPedido() {
    const form = document.querySelector('#formPedido');
    const clienteOption = document.querySelector(`#clientes-list option[value="${form.nome_cliente.value}"]`);
    
    if (!clienteOption) {
        throw new Error('Selecione um cliente válido');
    }

    const idCliente = clienteOption.dataset.id;
    const formaPgto = form.forma_pagamento.value;
    const parcelas = form.parcelas.value || 1;
    const vencimento = form.vencimento.value || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Coletar itens do pedido
    const itens = [];
    let todosItensValidos = true;
    
    document.querySelectorAll('.info-produtos').forEach(linha => {
        const select = linha.querySelector('.select-produto');
        const quantidade = parseFloat(linha.querySelector('.quantidade-produto').value);
        const desconto = parseFloat(linha.querySelector('.desconto-produto').value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
        
        if (!select.value || isNaN(quantidade) || quantidade <= 0) {
            todosItensValidos = false;
            return;
        }
        
        const precoUnitario = parseFloat(select.options[select.selectedIndex].dataset.preco);
        itens.push({
            idProduto: select.value,
            quantidade: quantidade,
            desconto: desconto,
            precoUnitario: precoUnitario
        });
    });
    
    if (!todosItensValidos || itens.length === 0) {
        throw new Error('Preencha todos os produtos corretamente');
    }
    
    // Calcular totais
    const subtotal = itens.reduce((sum, item) => sum + (item.quantidade * item.precoUnitario), 0);
    const totalDescontos = itens.reduce((sum, item) => sum + item.desconto, 0);
    const total = subtotal - totalDescontos;
    
    // Criar pedido no banco
    const response = await fetch('http://localhost:8080/api/pedidos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            idPessoa: idCliente,
            listaItens: itens,
            formaPgto: formaPgto,
            parcelas: parcelas,
            vencimento: vencimento,
            subtotal: subtotal,
            totalDescontos: totalDescontos,
            total: total,
            status: 'Aberto'
        })
    });
    
    if (!response.ok) {
        const erro = await response.json();
        throw new Error(erro.message || 'Erro ao registrar pedido');
    }
    
    const resultado = await response.json();
    
    // Atualizar estoque
    for (const item of itens) {
        await atualizarEstoque(item.idProduto, item.quantidade);
    }
    
    alert(`Pedido #${resultado.idPedido} criado com sucesso!`);
    form.reset();
}

async function atualizarEstoque(idProduto, quantidade) {
    try {
        const response = await fetch('http://localhost:8080/api/estoque/movimentacao', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                tipoMovimentacao: 'SAIDA',
                quantidade: quantidade,
                idProduto: idProduto,
                localizacao: 'Venda'
            })
        });
        
        if (!response.ok) {
            throw new Error('Falha ao atualizar estoque');
        }
    } catch (error) {
        console.error('Erro ao atualizar estoque:', error);
        throw error;
    }
}

function formatarDocumento(doc) {
    if (!doc) return '';
    const numeros = doc.replace(/\D/g, '');
    
    if (numeros.length === 11) {
        return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (numeros.length === 14) {
        return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return doc;
}

function formatarTelefone(telefone) {
    if (!telefone) return '';
    const numeros = telefone.replace(/\D/g, '');
    
    if (numeros.length === 11) {
        return numeros.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
    } else if (numeros.length === 10) {
        return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return telefone;
}

//testeLuan