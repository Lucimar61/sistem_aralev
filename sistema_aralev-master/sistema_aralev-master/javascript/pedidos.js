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
    if (formato === 'xlsx') {
        exportarParaXLSX();
    } else if (formato === 'pdf') {
        exportarParaPDF();
    }
    fecharPopup();
}

function exportarParaXLSX() {
    var tabela = document.querySelector('table'); // Seleciona a tabela
    var ws = XLSX.utils.table_to_sheet(tabela); // Converte a tabela em uma planilha
    var wb = XLSX.utils.book_new(); // Cria um novo livro de trabalho
    XLSX.utils.book_append_sheet(wb, ws, "Relatorio"); // Adiciona a planilha ao livro

    XLSX.writeFile(wb, 'relatorio_pedidos.xlsx'); // Salva o arquivo
}


// Função para exportar a tabela como PDF
// function exportarParaPDF() {
//     var elemento = document.querySelector('table'); // Seleciona a tabela
//     var opt = {
//         margin: 1,
//         filename: 'relatorio_pedidos.pdf',
//         image: { type: 'jpeg', quality: 0.98 },
//         html2canvas: { scale: 2 },
//         jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
//     };
//     html2pdf().from(elemento).set(opt).save();
// }

function exportarParaPDF() {
    clonarTabelaParaExportacao();

    const elemento = document.querySelector('#exportarPDF');

    if (!elemento) {
        console.error('Elemento #exportarPDF não encontrado!');
        return;
    }

    // Mostrar temporariamente para permitir a renderização
    elemento.style.display = 'block';

    // Forçar reflow para garantir que a tabela foi renderizada
    elemento.offsetHeight;  // Força o reflow do DOM

    var opt = {
        margin: [0.3, 0.3, 0.3, 0.3],
        filename: 'relatorio_pedidos',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
        pagebreak: { 
            mode: ['avoid-all', 'css', 'legacy'],
            before: '#quebrar-aqui',
            after: 'tr', // quebra depois de cada linha se necessário
         }
    };

    html2pdf().from(elemento).set(opt).save().then(() => {
        // Esconder novamente após a exportação
        elemento.style.display = 'none';
    });
}

function clonarTabelaParaExportacao() {
    const tabelaOriginal = document.querySelector('#tabelaPrincipal');
    
    // Verifique se a tabela existe antes de tentar clonar
    if (!tabelaOriginal) {
        console.error('Tabela não encontrada!');
        return;
    }
    
    const tabelaClone = tabelaOriginal.cloneNode(true);
    const tabelaExport = document.querySelector('#tabela-exportar');

    tabelaExport.innerHTML = ''; // Limpa antes
    tabelaExport.appendChild(tabelaClone);

    // Certifique-se de que os dados estão sendo copiados corretamente
    console.log(tabelaExport.innerHTML);  // Verifique se o conteúdo está correto

    // Estilização direta nas células
    const linhas = tabelaExport.querySelectorAll('tr');
    linhas.forEach(linha => {
        linha.querySelectorAll('th, td').forEach(celula => {
            celula.style.border = '1px solid #000';
            celula.style.padding = '8px';
            celula.style.textAlign = 'left';
            celula.style.fontSize = '12px';
        });
    });

}