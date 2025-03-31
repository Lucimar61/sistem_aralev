// Função para abrir a pop-up
function abrirPopup() {
    document.getElementById('exportPopup').style.display = 'flex';
}

// Função para fechar a pop-up
function fecharPopup() {
    document.getElementById('exportPopup').style.display = 'none';
}

// Função para exportar a tabela
function exportarTabela(formato) {
    if (formato === 'csv') {
        exportarParaCSV();
    } else if (formato === 'pdf') {
        exportarParaPDF();
    }
    fecharPopup();
}

// Função para exportar a tabela como CSV
function exportarParaCSV() {
    var tabela = document.querySelector('table'); // Seleciona a tabela
    var linhas = tabela.querySelectorAll('tr');
    var csv = [];

    for (var i = 0; i < linhas.length; i++) {
        var cols = linhas[i].querySelectorAll('td, th');
        var dados = [];
        for (var j = 0; j < cols.length; j++) {
            dados.push(cols[j].innerText);
        }
        csv.push(dados.join(','));
    }

    var csv_string = csv.join('\n');
    var filename = 'relatorio_pedidos.csv';
    var link = document.createElement('a');
    link.style.display = 'none';
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Função para exportar a tabela como PDF
function exportarParaPDF() {
    var elemento = document.querySelector('table'); // Seleciona a tabela
    var opt = {
        margin: 1,
        filename: 'relatorio_pedidos.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(elemento).set(opt).save();
}