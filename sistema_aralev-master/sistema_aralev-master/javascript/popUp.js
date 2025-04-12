/* Tela de clientes */
/* =========================================== */

function abrirPopUpClientes() {
    document.getElementById("popUpClientes").style.display = "block";
}

function fecharPopUpClientes() {
    document.getElementById("popUpClientes").style.display = "none"
}

// Fechar ao clicar fora do popUp
window.onclick = function(event) {
    let modal = document.getElementById("popUpClientes");

    if(event.target === modal) {
        modal.style.display = "none"
    }
}