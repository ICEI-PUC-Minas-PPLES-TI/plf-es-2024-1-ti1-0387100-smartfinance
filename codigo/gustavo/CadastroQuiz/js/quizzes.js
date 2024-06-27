// Importando a classe QuizzesService do arquivo de serviço
import { QuizzesService } from "../services/QuizzesService.js";

const quizzesService = new QuizzesService();
let perguntaCount = 0;
let currentQuiz = null;
let editQuizId = null;

$(document).ready(async function () {
    await renderQuizzes();

    // Event listeners para botões
    $('#btnIniciarQuiz').click(function () {
        const quizId = $(this).data('quiz-id');
        iniciarQuiz(quizId);
    });

    $('#btnEditarQuiz').click(function () {
        const quizId = $(this).data('quiz-id');
        editarQuiz(quizId);
    });

    $('#btnDeletarQuiz').click(function () {
        const quizId = $(this).data('quiz-id');
        deletarQuiz(quizId);
    });

    $('#btnAdicionarPergunta').click(adicionarPergunta);

    $('#btnCadastrarQuiz').click(cadastrarQuiz);

    $('#btnSalvarQuizEditado').click(salvarQuizEditado);

    $('#btnFinalizarQuiz').click(finalizarQuiz);

    $('#btnAdicionarPerguntaEditar').click(adicionarPerguntaEditar);
});

async function renderQuizzes() {
    try {
        const quizzes = await quizzesService.getQuizzes();

        $('#quizzesList').empty();
        quizzes.forEach(quiz => {
            const tempoEstimado = quiz.perguntas.length * 0.5;
            const quizHtml = `
            <li class="list-group-item bg-dark">
                <h5>${quiz.titulo}</h5>
                <p>Perguntas: ${quiz.perguntas.length}</p>
                <p>Tempo estimado: ${tempoEstimado} minutos</p>
                <button type="button" class="btn btn-primary btnIniciarQuiz" data-quiz-id="${quiz.id}">Iniciar</button>
                <button type="button" class="btn btn-danger btnEditarQuiz" data-quiz-id="${quiz.id}">Editar</button>
                <button type="button" class="btn btn-danger btnDeletarQuiz" data-quiz-id="${quiz.id}">Deletar</button>
            </li>`;
        
            $('#quizzesList').append(quizHtml);
        });

        $('.btnIniciarQuiz').click(function () {
            const quizId = $(this).data('quiz-id');
            iniciarQuiz(quizId);
        });

        $('.btnEditarQuiz').click(function () {
            const quizId = $(this).data('quiz-id');
            editarQuiz(quizId);
        });

        $('.btnDeletarQuiz').click(function () {
            const quizId = $(this).data('quiz-id');
            deletarQuiz(quizId);
        });
        
    } catch (error) {
        console.error('Error fetching quizzes:', error);
    }
}

async function adicionarPergunta() {
    perguntaCount++;
    const perguntaHtml = `
        <div class="form-group" id="pergunta${perguntaCount}">
            <label for="pergunta${perguntaCount}Texto">Pergunta ${perguntaCount}</label>
            <input type="text" class="form-control mb-2" id="pergunta${perguntaCount}Texto" required>
            <div id="respostas${perguntaCount}">
                <label>Respostas</label>
                <div class="input-group mb-2">
                    <input type="text" class="form-control" name="pergunta${perguntaCount}Resposta[]" placeholder="Resposta" required>
                    <div class="input-group-append">
                        <button type="button" class="btn btn-outline-secondary btnRemoverResposta">-</button>
                    </div>
                    <div class="input-group-append">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" name="pergunta${perguntaCount}Correto[]">
                            <label class="form-check-label">Correto</label>
                        </div>
                    </div>
                </div>
            </div>
            <button type="button" class="btn btn-secondary mb-2 btnAdicionarResposta" data-pergunta-id="${perguntaCount}">Adicionar Resposta</button>
        </div>`;
    $('#perguntasContainer').append(perguntaHtml);

    $('.btnRemoverResposta').off('click').on('click', function () {
        $(this).closest('.input-group').remove();
    });

    $('.btnAdicionarResposta').off('click').on('click', function () {
        const perguntaId = $(this).data('pergunta-id');
        adicionarResposta(perguntaId);
    });
}

async function cadastrarQuiz() {
    const titulo = $('#tituloQuiz').val();
    const descricao = $('#descricaoQuiz').val();
    const perguntas = [];

    for (let i = 1; i <= perguntaCount; i++) {
        const perguntaTexto = $(`#pergunta${i}Texto`).val();
        const respostas = $(`input[name="pergunta${i}Resposta[]"]`).map(function () {
            return $(this).val();
        }).get();
        const corretos = $(`input[name="pergunta${i}Correto[]"]`).map(function () {
            return $(this).is(':checked');
        }).get();

        if (perguntaTexto && respostas.length > 0) {
            const respostasArray = respostas.map((resposta, index) => ({
                "id_resposta": index + 1,
                "texto": resposta,
                "correto": corretos[index]
            }));
            perguntas.push({
                "id_pergunta": i,
                "texto": perguntaTexto,
                "respostas": respostasArray
            });
        }
    }

    if (titulo && descricao && perguntas.length > 0) {
        const novoQuiz = {
            "titulo": titulo,
            "descricao": descricao,
            "perguntas": perguntas
        };

        try {
            await quizzesService.criarQuiz(novoQuiz);
            await renderQuizzes();
            $('#cadastrarQuizForm')[0].reset();
            $('#perguntasContainer').empty();
            perguntaCount = 0;
            $('#cadastrarQuizModal').modal('hide');
        } catch (error) {
            console.error('Error creating quiz:', error);
        }
    } else {
        console.error('Por favor, preencha todos os campos obrigatórios.');
    }
}

async function editarQuiz(quizId) {
    try {
        const quiz = await quizzesService.getQuiz(quizId);
        editQuizId = quizId;
        $('#editarTituloQuiz').val(quiz.titulo);
        $('#editarDescricaoQuiz').val(quiz.descricao);
        $('#editarPerguntasContainer').empty();
        quiz.perguntas.forEach(pergunta => {
            const perguntaHtml = `
                <div class="form-group" id="editarPergunta${pergunta.id_pergunta}">
                    <label for="editarPergunta${pergunta.id_pergunta}Texto">Pergunta ${pergunta.id_pergunta}</label>
                    <input type="text" class="form-control mb-2" id="editarPergunta${pergunta.id_pergunta}Texto" value="${pergunta.texto}" required>
                    <div id="editarRespostas${pergunta.id_pergunta}">
                        <label>Respostas</label>
                        ${pergunta.respostas.map(resposta =>
                `<div class="input-group mb-2">
                                    <input type="text" class="form-control" name="editarPergunta${pergunta.id_pergunta}Resposta[]" value="${resposta.texto}" required>
                                    <div class="input-group-append">
                                        <button type="button" class="btn btn-outline-secondary btnRemoverResposta">-</button>
                                    </div>
                                    <div class="input-group-append">
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="checkbox" name="editarPergunta${pergunta.id_pergunta}Correto[]" ${resposta.correto ? 'checked' : ''}>
                                            <label class="form-check-label">Correto</label>
                                        </div>
                                    </div>
                                </div>`).join('')}
                    </div>
                    <button type="button" class="btn btn-secondary mb-2 btnAdicionarRespostaEditar" data-pergunta-id="${pergunta.id_pergunta}">Adicionar Resposta</button>
                </div>`;
            $('#editarPerguntasContainer').append(perguntaHtml);
        });

        $('.btnRemoverResposta').off('click').on('click', function () {
            $(this).closest('.input-group').remove();
        });

        $('.btnAdicionarRespostaEditar').off('click').on('click', function () {
            const perguntaId = $(this).data('pergunta-id');
            adicionarRespostaEditar(perguntaId);
        });

        $('#editarQuizModal').modal('show');
    } catch (error) {
        console.error('Error fetching quiz for editing:', error);
    }
}

async function salvarQuizEditado() {
    const editQuizId = $('#editarQuizId').val(); // Obtém o ID do quiz a ser editado
    const titulo = $('#editarTituloQuiz').val(); // Obtém o valor do campo de título
    const descricao = $('#editarDescricaoQuiz').val(); // Obtém o valor do campo de descrição
    const perguntas = [];

    $('#editarPerguntasContainer').children().each(function () {
        const perguntaId = $(this).attr('id').replace('editarPergunta', '');
        const perguntaTexto = $(`#editarPergunta${perguntaId}Texto`).val();
        const respostas = $(`input[name="editarPergunta${perguntaId}Resposta[]"]`).map(function () {
            return $(this).val();
        }).get();
        const corretos = $(`input[name="editarPergunta${perguntaId}Correto[]"]`).map(function () {
            return $(this).is(':checked');
        }).get();

        if (perguntaTexto && respostas.length > 0) {
            const respostasArray = respostas.map((resposta, index) => ({
                "id_resposta": index + 1,
                "texto": resposta,
                "correto": corretos[index]
            }));
            perguntas.push({
                "id_pergunta": parseInt(perguntaId),
                "texto": perguntaTexto,
                "respostas": respostasArray
            });
        }
    });

    if (titulo && descricao && perguntas.length > 0 && editQuizId) {
        const quizEditado = {
            "id": editQuizId,
            "titulo": titulo,
            "descricao": descricao,
            "perguntas": perguntas
        };

        try {
            await quizzesService.atualizarQuiz(quizEditado);
            await renderQuizzes();
            $('#editarQuizModal').modal('hide');
        } catch (error) {
            console.error('Error updating quiz:', error);
        }
    } else {
        console.error('Por favor, preencha todos os campos obrigatórios.');
    }
}


async function deletarQuiz(quizId) {
    console.log('Deletando quiz com ID:', quizId);
    try {
        await quizzesService.deletarQuiz(quizId);
        await renderQuizzes();
    } catch (error) {
        console.error('Error deleting quiz:', error);
    }
}

// Event listener para botões de deleção dentro de renderQuizzes
$('.btnDeletarQuiz').click(function () {
    const quizId = $(this).data('quiz-id');
    deletarQuiz(quizId);
});

async function iniciarQuiz(quizId) {
    try {
        const quiz = await quizzesService.getQuiz(quizId);

        // Limpar conteúdo do modal antes de exibir
        $('#quizPerguntasContainer').empty();

        // Exibir todas as perguntas no modal
        quiz.perguntas.forEach((pergunta, index) => {
            const perguntaHtml = `
                <div class="form-group">
                    <label for="perguntaTexto${index}">${pergunta.texto}</label>
                    <select class="form-control respostaPergunta" data-pergunta-index="${index}">
                        ${pergunta.respostas.map(resposta =>
                            `<option value="${resposta.texto}">${resposta.texto}</option>`
                        ).join('')}
                    </select>
                </div>`;
            $('#quizPerguntasContainer').append(perguntaHtml);
        });

        // Exibir modal
        $('#iniciarQuizModal').modal('show');

        // Evento para finalizar o quiz
        $('#btnFinalizarQuiz').off('click').on('click', function () {
            const pontuacao = calcularPontuacao(quiz);
            mostrarPontuacaoFinal(pontuacao);
            $('#iniciarQuizModal').modal('hide');
        });

    } catch (error) {
        console.error('Error starting quiz:', error);
    }
}

function calcularPontuacao(quiz) {
    let pontuacao = 0;

    $('.respostaPergunta').each(function () {
        const perguntaIndex = $(this).data('pergunta-index');
        const respostaSelecionada = $(this).val();
        const respostaCorreta = quiz.perguntas[perguntaIndex].respostas.find(resposta => resposta.correto);

        if (respostaSelecionada === respostaCorreta.texto) {
            pontuacao++;
        }
    });

    return pontuacao;
}

function mostrarPontuacaoFinal(pontuacao) {
    alert(`Pontuação final: ${pontuacao}`);
}

// Event listener para o botão Finalizar Quiz no modal de iniciar quiz
$('#btnFinalizarQuiz').click(function () {
    // Implementar a lógica para finalizar o quiz, se necessário
    console.log('Quiz finalizado');
});

async function finalizarQuiz() {
    // Implementar lógica para finalizar o quiz
    console.log('Finalizando quiz...');
}

function adicionarResposta(perguntaId) {
    const respostaHtml = `
        <div class="input-group mb-2">
            <input type="text" class="form-control" name="pergunta${perguntaId}Resposta[]" placeholder="Resposta" required>
            <div class="input-group-append">
                <button type="button" class="btn btn-outline-secondary btnRemoverResposta">-</button>
            </div>
            <div class="input-group-append">
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" name="pergunta${perguntaId}Correto[]">
                    <label class="form-check-label">Correto</label>
                </div>
            </div>
        </div>`;
    $(`#respostas${perguntaId}`).append(respostaHtml);

    $('.btnRemoverResposta').off('click').on('click', function () {
        $(this).closest('.input-group').remove();
    });
}

function adicionarRespostaEditar(perguntaId) {
    const respostaHtml = `
        <div class="input-group mb-2">
            <input type="text" class="form-control" name="editarPergunta${perguntaId}Resposta[]" placeholder="Resposta" required>
            <div class="input-group-append">
                <button type="button" class="btn btn-outline-secondary btnRemoverResposta">-</button>
            </div>
            <div class="input-group-append">
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" name="editarPergunta${perguntaId}Correto[]">
                    <label class="form-check-label">Correto</label>
                </div>
            </div>
        </div>`;
    $(`#editarRespostas${perguntaId}`).append(respostaHtml);

    $('.btnRemoverResposta').off('click').on('click', function () {
        $(this).closest('.input-group').remove();
    });
}

function adicionarPerguntaEditar() {
    perguntaCount++;
    const perguntaHtml = `
        <div class="form-group" id="editarPergunta${perguntaCount}">
            <label for="editarPergunta${perguntaCount}Texto">Pergunta ${perguntaCount}</label>
            <input type="text" class="form-control mb-2" id="editarPergunta${perguntaCount}Texto" required>
            <div id="editarRespostas${perguntaCount}">
                <label>Respostas</label>
                <div class="input-group mb-2">
                    <input type="text" class="form-control" name="editarPergunta${perguntaCount}Resposta[]" placeholder="Resposta" required>
                    <div class="input-group-append">
                        <button type="button" class="btn btn-outline-secondary btnRemoverResposta">-</button>
                    </div>
                    <div class="input-group-append">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" name="editarPergunta${perguntaCount}Correto[]">
                            <label class="form-check-label">Correto</label>
                        </div>
                    </div>
                </div>
            </div>
            <button type="button" class="btn btn-secondary mb-2 btnAdicionarRespostaEditar" data-pergunta-id="${perguntaCount}">Adicionar Resposta</button>
        </div>`;
    $('#editarPerguntasContainer').append(perguntaHtml);

    $('.btnRemoverResposta').off('click').on('click', function () {
        $(this).closest('.input-group').remove();
    });

    $('.btnAdicionarRespostaEditar').off('click').on('click', function () {
        const perguntaId = $(this).data('pergunta-id');
        adicionarRespostaEditar(perguntaId);
    });
}
