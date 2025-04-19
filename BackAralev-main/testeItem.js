const Item = require('./src/models/Item');

async function testarItem() {
    try {
        // Criar um novo item
        const novoItem = new Item(
            null,               // idProduto (gerado automaticamente pelo banco)
            'Caneta Azul',      // nome
            100,                // quantidade
            1.00,               // precoCusto
            2.50,               // precoVenda
            'Caneta esferográfica azul', // descricao
            'material-escolar',          // tag
            'un'                         // medida
        );

        // Salvar no banco
        const idCriado = await novoItem.salvar();

        if (idCriado) {
            console.log(`✅ Produto cadastrado com sucesso! ID: ${idCriado}`);
        } else {
            console.log('❌ Falha ao cadastrar o produto.');
        }

        // Buscar o item criado
        const itemBuscado = await Item.buscarPorId(idCriado);
        console.log('📦 Item cadastrado:', itemBuscado);

    } catch (error) {
        console.error('💥 Erro ao testar cadastro de item:', error.message);
    }
}

testarItem();
