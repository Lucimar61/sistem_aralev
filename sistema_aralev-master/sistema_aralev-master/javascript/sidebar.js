// Função para definir o link ativo na sidebar
document.addEventListener('DOMContentLoaded', function() {
    
    var menuItem = document.querySelectorAll('.side-item')

    function selectLink() {
        menuItem.forEach((item) => 
            item.classList.remove('active')
        )
        this.classList.add('active')
    }

    menuItem.forEach((item) =>
        item.addEventListener('click', selectLink)
    )

});

// document.addEventListener("DOMContentLoaded", () => {
//     const openBtn = document.getElementById("open_btn");
//     const sidebar = document.getElementById("sidebar_content");
//     const icons = document.querySelectorAll(".item-description");

//     if (openBtn && sidebar) {
//         openBtn.addEventListener("click", () => {
//             sidebar.classList.toggle("expandido");

//             // Alterna visibilidade dos textos dos itens da sidebar
//             icons.forEach(icon => {
//                 icon.classList.toggle("hidden");
//             });
//         });
//     } else {
//         console.warn("Sidebar ou botão de abrir não encontrados!");
//     }
// });

