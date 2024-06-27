function changeForm() {
  const form = document.getElementById('contentForm');
  form.innerHTML = ''; // Limpa o formulário
  const type = document.getElementById('contentType').value;

  if (type === 'video') {
      form.innerHTML = `
          <input type="text" id="videoName" placeholder="Nome do Vídeo">
          <textarea id="videoDescription" placeholder="Descrição do Vídeo"></textarea>
          <input type="file" id="videoFile" accept="video/*">
      `;
  } else if (type === 'artigo') {
      form.innerHTML = `
          <textarea id="articleText" placeholder="Texto do Artigo"></textarea>
          <input type="file" id="articleImage" accept="image/*">
      `;
  }
}

function submitContent() {
  // Aqui você pode adicionar a lógica para processar e armazenar os dados do formulário
  alert('Conteúdo enviado com sucesso!');
}

// Inicializa o formulário com o tipo de conteúdo 'video'
changeForm();
