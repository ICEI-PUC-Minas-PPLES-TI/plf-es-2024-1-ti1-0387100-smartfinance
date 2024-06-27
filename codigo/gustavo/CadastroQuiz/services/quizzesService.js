export class QuizzesService {
    constructor() {
        this.urlBase = "http://localhost:3000/quizzes";
    }

    async getQuizzes() {
        try {
            const resposta = await fetch(this.urlBase);
            if (!resposta.ok) {
                throw new Error('Erro ao obter quizzes');
            }
            return resposta.json();
        } catch (error) {
            console.error('Erro ao obter quizzes:', error);
            throw error;
        }
    }

    async getQuiz(id) {
        try {
            const resposta = await fetch(`${this.urlBase}/${id}`);
            if (!resposta.ok) {
                throw new Error('Erro ao obter quiz');
            }
            return resposta.json();
        } catch (error) {
            console.error(`Erro ao obter quiz ${id}:`, error);
            throw error;
        }
    }

    async criarQuiz(quiz) {
        try {
            const resposta = await fetch(this.urlBase, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(quiz)
            });
            if (!resposta.ok) {
                throw new Error('Erro ao criar quiz');
            }
            return resposta.json();
        } catch (error) {
            console.error('Erro ao criar quiz:', error);
            throw error;
        }
    }

    async atualizarQuiz(id, quiz) {
        try {
            const resposta = await fetch(`${this.urlBase}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(quiz)
            });
            if (!resposta.ok) {
                throw new Error('Erro ao atualizar quiz');
            }
            return resposta.json();
        } catch (error) {
            console.error(`Erro ao atualizar quiz ${id}:`, error);
            throw error;
        }
    }

    async deletarQuiz(id) {
        try {
            const resposta = await fetch(`${this.urlBase}/${id}`, {
                method: 'DELETE'
            });
            if (!resposta.ok) {
                throw new Error('Erro ao deletar quiz');
            }
            return resposta.json();
        } catch (error) {
            console.error(`Erro ao deletar quiz ${id}:`, error);
            throw error;
        }
    }
}