document.addEventListener("DOMContentLoaded", function() {
    fetch('../db/db.json')
        .then(response => response.json())
        .then(data => {
            const criadoresFinanceira = document.getElementById('criadores-financeira');
            const selecionadosFinanceira = document.getElementById('selecionados-financeira');
            const criadoresInvestimento = document.getElementById('criadores-investimento');
            const selecionadosInvestimento = document.getElementById('selecionados-investimento');
            const artigosSemana = document.getElementById('artigos-semana');

            // Filtrar dados para categorias específicas
            const financeiraContents = data.conteudos.filter(content => content.categoria_id === 1);
            const investimentoContents = data.conteudos.filter(content => content.categoria_id === 2);

            const autores = data.autores;

            // Função para obter o caminho da imagem do autor
            function getAuthorImagePath(autorId) {
                return `./images/autor${autorId}.jpg`;
            }

            // Criadores de Conteúdo - Educação Financeira
            const financialCreators = autores.filter(autor => financeiraContents.some(content => content.autor_id === autor.id));
            financialCreators.forEach(autor => {
                const creatorCard = document.createElement('div');
                creatorCard.className = 'card';
                creatorCard.innerHTML = `
                    <img src="${getAuthorImagePath(autor.id)}" alt="${autor.nome}">
                    <div class="card-content">
                        <div class="card-title">${autor.nome}</div>
                        <a href="${autor.website}" target="_blank">Visitar site</a>
                    </div>`;
                criadoresFinanceira.appendChild(creatorCard);
            });

            // Criadores de Conteúdo - Investimento
            const investmentCreators = autores.filter(autor => investimentoContents.some(content => content.autor_id === autor.id));
            investmentCreators.forEach(autor => {
                const creatorCard = document.createElement('div');
                creatorCard.className = 'card';
                creatorCard.innerHTML = `
                    <img src="${getAuthorImagePath(autor.id)}" alt="${autor.nome}">
                    <div class="card-content">
                        <div class="card-title">${autor.nome}</div>
                        <a href="${autor.website}" target="_blank">Visitar site</a>
                    </div>`;
                criadoresInvestimento.appendChild(creatorCard);
            });

            // Selecionados para Você - Educação Financeira
            financeiraContents.forEach(content => {
                const videoCard = document.createElement('div');
                videoCard.className = 'card';
                videoCard.innerHTML = `
                    <div class="card-content">
                        <div class="card-title">${content.titulo}</div>
                        <div class="card-description">${content.descricao}</div>
                        <a href="${content.links[0].url}" target="_blank">Ver mais</a>
                    </div>`;
                selecionadosFinanceira.appendChild(videoCard);
            });

            // Selecionados para Você - Investimento
            investimentoContents.forEach(content => {
                const videoCard = document.createElement('div');
                videoCard.className = 'card';
                videoCard.innerHTML = `
                    <div class="card-content">
                        <div class="card-title">${content.titulo}</div>
                        <div class="card-description">${content.descricao}</div>
                        <a href="${content.links[0].url}" target="_blank">Ver mais</a>
                    </div>`;
                selecionadosInvestimento.appendChild(videoCard);
            });

            // Artigos da Semana
            const articles = data.conteudos.filter(content => new Date(content.data_publicacao).getMonth() === new Date().getMonth());
            articles.forEach(article => {
                const articleCard = document.createElement('div');
                articleCard.className = 'card';
                articleCard.innerHTML = `
                    <div class="card-content">
                        <div class="card-title">${article.titulo}</div>
                        <div class="card-description">${article.descricao}</div>
                        <a href="${article.links[0].url}" target="_blank">Ler mais</a>
                    </div>`;
                artigosSemana.appendChild(articleCard);
            });
        })
        .catch(error => console.error('Erro ao carregar os dados:', error));
});
document.addEventListener("DOMContentLoaded", function() {
    let sidebar = document.querySelector(".sidebar");
    let closeBtn = document.querySelector("#btn");
    let homeLink = document.querySelector("#home-link");
    let navList = document.querySelector(".nav-list");
  
    closeBtn.addEventListener("click", () => {
        sidebar.classList.toggle("open");
        menuBtnChange();
        toggleHomeLink();
        toggleNavList();
        toggleBtnCenter();
    });
  
    homeLink.addEventListener("click", (e) => {
      if (!sidebar.classList.contains("open")) {
        e.preventDefault(); 
      } else {
        sidebar.classList.add("open");
        menuBtnChange();
      }
    });
  
    function toggleHomeLink() {
      if (sidebar.classList.contains("open")) {
        homeLink.classList.remove("disabled-link");
      } else {
        homeLink.classList.add("disabled-link");
      }
    }
  
    function toggleNavList() {
      if (sidebar.classList.contains("open")) {
        navList.classList.remove("hide");
      } else {
        navList.classList.add("hide");
      }
    }
  
    function toggleBtnCenter() {
      if (window.innerWidth <= 420) {
        if (sidebar.classList.contains("open")) {
          closeBtn.classList.remove("center");
        } else {
          closeBtn.classList.add("center");
        }
      } else {
        closeBtn.classList.remove("center");
      }
    }
  
    toggleHomeLink();
    toggleNavList();
    toggleBtnCenter();
  
    function menuBtnChange() {
        if (sidebar.classList.contains("open")) {
            closeBtn.classList.replace("bx-menu", "bx-menu-alt-right"); 
        } else {
            closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");
        }
    }
  
    window.addEventListener('resize', toggleBtnCenter);
  });
