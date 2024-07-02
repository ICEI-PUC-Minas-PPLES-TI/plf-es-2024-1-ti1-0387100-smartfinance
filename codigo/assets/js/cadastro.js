document.addEventListener('DOMContentLoaded', function () {
  // Carregar os dados do JSON
  fetch('/codigo/db/db.json')
      .then(response => response.json())
      .then(data => {
          const autores = data.autores;
          const categorias = data.categorias;

          const autorSelect = document.getElementById('autor');
          const categoriaSelect = document.getElementById('categoria');
          const tipoSelect = document.getElementById('tipo');
          const linkArtigoDiv = document.getElementById('link_artigo_div');
          const linkVideoDiv = document.getElementById('link_video_div');

          // Preencher o select de autores
          autores.forEach(autor => {
              const option = document.createElement('option');
              option.value = autor.id;
              option.textContent = autor.nome;
              autorSelect.appendChild(option);
          });

          // Preencher o select de categorias
          categorias.forEach(categoria => {
              const option = document.createElement('option');
              option.value = categoria.id;
              option.textContent = categoria.nome;
              categoriaSelect.appendChild(option);
          });

          // Alternar exibição dos campos de link conforme o tipo de conteúdo
          tipoSelect.addEventListener('change', function () {
              if (tipoSelect.value === 'artigo') {
                  linkArtigoDiv.style.display = 'block';
                  linkVideoDiv.style.display = 'none';
              } else if (tipoSelect.value === 'video') {
                  linkArtigoDiv.style.display = 'none';
                  linkVideoDiv.style.display = 'block';
              }
          });

          // Lidar com o envio do formulário
          document.getElementById('cadastro-form').addEventListener('submit', function (event) {
              event.preventDefault();

              const novoConteudo = {
                  id: Date.now(),
                  tipo: tipoSelect.value,
                  titulo: document.getElementById('titulo').value,
                  descricao: document.getElementById('descricao').value,
                  autor_id: parseInt(document.getElementById('autor').value),
                  data_publicacao: document.getElementById('data_publicacao').value,
                  categoria_id: parseInt(document.getElementById('categoria').value),
                  tags: document.getElementById('tags').value.split(',').map(tag => tag.trim()),
                  links: []
              };

              if (novoConteudo.tipo === 'artigo') {
                  novoConteudo.links.push({ tipo: 'artigo', url: document.getElementById('link_artigo').value });
              } else if (novoConteudo.tipo === 'video') {
                  novoConteudo.links.push({ tipo: 'video', url: document.getElementById('link_video').value });
              }

              console.log('Conteúdo cadastrado:', novoConteudo);
              alert('Conteúdo cadastrado com sucesso!');
              document.getElementById('cadastro-form').reset();
          });
      })
      .catch(error => console.error('Erro ao carregar os dados:', error));
});
