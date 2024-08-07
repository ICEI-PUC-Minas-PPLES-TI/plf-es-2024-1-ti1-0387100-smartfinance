document.addEventListener('DOMContentLoaded', function () {
  const apiUrl = 'http://localhost:3000/usuarios';

  // Função para autenticar usuário
  async function autenticarUsuario(email, password) {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Erro ao buscar usuários');
      }

      const usuarios = await response.json();
      const usuarioEncontrado = usuarios.find(user => user.email === email && user.password === password);

      if (usuarioEncontrado) {
        console.log('Login realizado com sucesso:', usuarioEncontrado);
        alert('Login realizado com sucesso!');
        window.location.href = 'index.html';  // Redirecionar para a página inicial
      } else {
        alert('Email ou senha incorretos.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao realizar login');
    }
  }

  // Validação do formulário de login
  document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    autenticarUsuario(email, password);
  });

  // Lógica para manipulação da sidebar
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
