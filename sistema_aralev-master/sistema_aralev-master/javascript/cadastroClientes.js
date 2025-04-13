document.addEventListener('DOMContentLoaded', function() {
    inicializarMascaras();
    inicializarEventos();
    carregarClientes();
});

// Máscaras para os campos
function inicializarMascaras() {
    $('input[name="num_celular"]').mask('(00) 0 0000-0000');
    
    $('input[name="cpf_ou_cnpj"]').mask('000.000.000-00', {reverse: true});
    
    $('input[name="CEP"]').mask('00000-000');
    
    $('input[name="UF"]').mask('AA');
}

function inicializarEventos() {
    document.getElementById('salvarClientes').addEventListener('click', salvarCliente);
    
    $('input[name="cpf_ou_cnpj"]').on('keyup', function() {
        const valor = $(this).cleanVal();
        if (valor.length > 11) {
            $(this).mask('00.000.000/0000-00', {reverse: true});
        } else {
            $(this).mask('000.000.000-00', {reverse: true});
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
        
        if (!response.ok) {
            throw new Error('Erro ao carregar clientes');
        }
        
        const clientes = await response.json();
        preencherTabelaClientes(clientes);
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar clientes: ' + error.message);
    }
}

function preencherTabelaClientes(clientes) {
    const tbody = document.getElementById('tabale-clientes');
    tbody.innerHTML = '';
    
    clientes.forEach(cliente => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${cliente.idPessoa}</td>
            <td>${cliente.nome}</td>
            <td>${cliente.celular}</td>
            <td>${formatarDocumento(cliente.cpfCnpj)}</td>
            <td>${cliente.rua}</td>
            <td>${cliente.numero}</td>
            <td>${cliente.cep || 'N/A'}</td>
            <td>${cliente.cidade}</td>
            <td>${cliente.uf}</td>
            <td class="acoes">
                <button class="btn-editar" onclick="editarCliente(${cliente.idPessoa})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-excluir" onclick="excluirCliente(${cliente.idPessoa})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
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

async function salvarCliente() {
    fecharPopUpClientes();
    
    const form = document.querySelector('form');
    const formData = {
        nome: form.nome_cliente.value,
        celular: $(form.num_celular).cleanVal(),
        cpfCnpj: $(form.cpf_ou_cnpj).cleanVal(),
        rua: form.nome_rua.value,
        numero: form.numero_casa.value,
        bairro: 'N/A', 
        cidade: form.cidade.value,
        uf: form.UF.value.toUpperCase(),
        cep: $(form.CEP).cleanVal() 
    };
    
    try {
        const response = await fetch('http://localhost:8080/api/pessoas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(formData)
        });
        
        const resultado = await response.json();
        
        if (!response.ok) {
            throw new Error(resultado.erro || 'Erro ao salvar cliente');
        }
        
        alert('Cliente cadastrado com sucesso!');
        form.reset();
        carregarClientes(); 
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao salvar cliente: ' + error.message);
    }
}

async function editarCliente(id) {
    try {
        const response = await fetch(`http://localhost:8080/api/pessoas/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Erro ao carregar dados do cliente');
        }
        
        const cliente = await response.json();
        preencherFormularioEdicao(cliente);
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao editar cliente: ' + error.message);
    }
}

function preencherFormularioEdicao(cliente) {
    const form = document.querySelector('form');
    
    form.nome_cliente.value = cliente.nome;
    form.num_celular.value = cliente.celular ? formatarTelefone(cliente.celular) : '';
    form.cpf_ou_cnpj.value = formatarDocumento(cliente.cpfCnpj);
    form.nome_rua.value = cliente.rua;
    form.numero_casa.value = cliente.numero;
    form.cidade.value = cliente.cidade;
    form.UF.value = cliente.uf;
    
    const btnSalvar = document.getElementById('btn-salvar-cliente');
    btnSalvar.textContent = 'Atualizar';
    btnSalvar.onclick = function() {
        abrirPopUpClientes('atualizar');
    };
    
    form.dataset.idEdicao = cliente.idPessoa;
}

async function atualizarCliente() {
    fecharPopUpClientes();
    
    const form = document.querySelector('form');
    const id = form.dataset.idEdicao;
    
    const formData = {
        nome: form.nome_cliente.value,
        celular: $(form.num_celular).cleanVal(),
        cpfCnpj: $(form.cpf_ou_cnpj).cleanVal(),
        rua: form.nome_rua.value,
        numero: form.numero_casa.value,
        bairro: 'N/A',
        cidade: form.cidade.value,
        uf: form.UF.value.toUpperCase(),
        cep: $(form.CEP).cleanVal()
    };
    
    try {
        const response = await fetch(`http://localhost:8080/api/pessoas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(formData)
        });
        
        const resultado = await response.json();
        
        if (!response.ok) {
            throw new Error(resultado.erro || 'Erro ao atualizar cliente');
        }
        
        alert('Cliente atualizado com sucesso!');
        resetarFormulario();
        carregarClientes(); 
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao atualizar cliente: ' + error.message);
    }
}

async function excluirCliente(id) {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) {
        return;
    }
    
    try {
        const response = await fetch(`http://localhost:8080/api/pessoas/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Erro ao excluir cliente');
        }
        
        alert('Cliente excluído com sucesso!');
        carregarClientes(); // Atualiza a tabela
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao excluir cliente: ' + error.message);
    }
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

function resetarFormulario() {
    const form = document.querySelector('form');
    form.reset();
    
    const btnSalvar = document.getElementById('btn-salvar-cliente');
    btnSalvar.textContent = 'Salvar';
    btnSalvar.onclick = function() {
        abrirPopUpClientes();
    };
    
    if (form.dataset.idEdicao) {
        delete form.dataset.idEdicao;
    }
}

function abrirPopUpClientes(modo = 'cadastrar') {
    const popup = document.getElementById('popUpClientes');
    const btnSalvar = document.getElementById('salvarClientes');
    
    if (modo === 'atualizar') {
        btnSalvar.onclick = atualizarCliente;
        popup.querySelector('p').textContent = 'Você está prestes a atualizar um cliente. Deseja continuar?';
    } else {
        btnSalvar.onclick = salvarCliente;
        popup.querySelector('p').textContent = 'Você está prestes a cadastrar um cliente. Deseja continuar?';
    }
    
    popup.style.display = 'flex';
}

function fecharPopUpClientes() {
    document.getElementById('popUpClientes').style.display = 'none';
}