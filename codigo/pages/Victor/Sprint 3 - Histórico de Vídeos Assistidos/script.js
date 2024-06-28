
function adicionarVideo(video) {
    var historico = document.getElementById('historico');
    var videoItem = document.createElement('div');
    videoItem.className = 'video-item';
    videoItem.innerHTML = '<p class="video-title">' + video + '</p><button class="video-delete" onclick="removerVideo(this)">Excluir</button>';
    historico.appendChild(videoItem);
  }
  

  function removerVideo(botao) {
    var videoItem = botao.parentNode;
    videoItem.parentNode.removeChild(videoItem);
  }
  

  function limparHistorico() {
    var historico = document.getElementById('historico');
    historico.innerHTML = '';
  }
  
 
  adicionarVideo('Vídeo 1');
  adicionarVideo('Vídeo 2');
  adicionarVideo('Vídeo 3');