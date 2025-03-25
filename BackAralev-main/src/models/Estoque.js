const {item} = require('./Item');

class Estoque {
    constructor(idEstoque, localizacao, item) {
        this.idEstoque = idEstoque;
        this.localizacao = localizacao;
        this.item = item;
        this.quantidade = 0; 
        this.historico = []; 
    }

    atualizarEstoque(tipoMovimentacao, quantidade, usuarioResponsavel, data = new Date().toISOString().split('T')[0]) {
        if (!['ENTRADA', 'SAIDA'].includes(tipoMovimentacao)) {
            throw new Error('Tipo de movimentação inválido. Use ENTRADA ou SAIDA');
        }

        if (quantidade <= 0) {
            throw new Error('Quantidade deve ser maior que zero');
        }

        if (tipoMovimentacao === 'SAIDA' && quantidade > this.quantidade) {
            throw new Error('Quantidade indisponível em estoque');
        }

        // Atualiza a quantidade
        if (tipoMovimentacao === 'ENTRADA') {
            this.quantidade += quantidade;
        } else {
            this.quantidade -= quantidade;
        }

        // Registra no histórico
        const movimentacao = {
            data,
            tipoMovimentacao,
            quantidade,
            saldoAtual: this.quantidade,
            usuarioResponsavel
        };

        this.historico.push(movimentacao);

        return this;
    }


    consultarEstoque(consultarHistorico = false) {
        if (consultarHistorico) {
            return this.historico;
        }

        return {
            idEstoque: this.idEstoque,
            localizacao: this.localizacao,
            item: this.item,
            quantidadeAtual: this.quantidade,
            atualizadoEm: this.historico.length > 0 
                ? this.historico[this.historico.length - 1].data 
                : 'Nunca'
        };
    }
}

module.exports = Estoque;