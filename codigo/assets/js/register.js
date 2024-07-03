document.addEventListener('DOMContentLoaded', function () {
  const apiUrl = 'http://localhost:3000/usuarios';

  // Função para cadastrar um novo usuário
  async function cadastrarUsuario(novoUsuario) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoUsuario)
      });

      if (!response.ok) {
        throw new Error('Erro ao cadastrar usuário');
      }

      console.log('Usuário cadastrado:', novoUsuario);
      alert('Usuário cadastrado com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao cadastrar usuário');
    }
  }

  // Validação do formulário de cadastro
  document.getElementById('cadastro-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }

    const novoUsuario = {
      id: Date.now(),
      username: document.getElementById('username').value,
      email: document.getElementById('email').value,
      password: password
    };

    cadastrarUsuario(novoUsuario);
    document.getElementById('cadastro-form').reset();
  });

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
