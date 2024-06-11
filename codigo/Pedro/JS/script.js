document.addEventListener('DOMContentLoaded', function() {
    const days = document.querySelectorAll('.day');
    const selectedDayElement = document.getElementById('selected-day');
    const suggestionsElement = document.getElementById('suggestions');
    const monthlyReportElement = document.getElementById('monthly-report');

    const dailyCtx = document.getElementById('dailyChart').getContext('2d');
    
    let dailyChart = new Chart(dailyCtx, {
        type: 'bar',
        data: {
            labels: ['Categoria 1', 'Categoria 2', 'Categoria 3'],
            datasets: [{
                label: 'Gastos',
                data: [],
                backgroundColor: ['red', 'blue', 'green'],
                borderColor: ['red', 'blue', 'green'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    function updateDailyChartData(data) {
        dailyChart.data.datasets[0].data = data;
        dailyChart.update();
    }

    function updateSuggestions(data) {
        if (data.every(value => value === 0)) {
            suggestionsElement.innerHTML = `
                <h2>Sugestões de Gastos</h2>
                <p>Você ainda não direcionou gastos em nenhuma categoria.</p>
            `;
            return;
        }

        let maxCategory = data.indexOf(Math.max(...data));
        let categoryNames = ['Categoria 1', 'Categoria 2', 'Categoria 3'];
        let suggestions = [
            'Considere reduzir seus gastos em ' + categoryNames[maxCategory] + ', como evitar gastar excessivamente nesta área.',
            'Avalie suas despesas em ' + categoryNames[maxCategory] + ', buscando alternativas mais econômicas.',
            'Revise seus gastos em ' + categoryNames[maxCategory] + ', priorizando suas despesas de forma mais eficiente.'
        ];

        suggestionsElement.innerHTML = `
            <h2>Sugestões de Gastos</h2>
            <p>${suggestions[maxCategory]}</p>
        `;
    }

    days.forEach(day => {
        day.addEventListener('click', () => {
            const selectedDay = day.textContent;
            selectedDayElement.textContent = selectedDay;

            // Limpa o gráfico e as sugestões quando um novo dia é selecionado
            updateDailyChartData([]);
            updateSuggestions([]);
        });
    });

    document.getElementById('update-chart').addEventListener('click', () => {
        const category1 = parseInt(document.getElementById('amount1').value) || 0;
        const category2 = parseInt(document.getElementById('amount2').value) || 0;
        const category3 = parseInt(document.getElementById('amount3').value) || 0;

        const data = [category1, category2, category3];
        updateDailyChartData(data);
        updateSuggestions(data);
    });

    selectedDayElement.addEventListener('click', () => {
        const isExpanded = selectedDayElement.classList.contains('expanded');
        if (!isExpanded) {
            document.getElementById('location').classList.remove('hidden');
            document.getElementById('budget').classList.remove('hidden');
        }
        selectedDayElement.classList.toggle('expanded');
    });

    document.getElementById('budget').addEventListener('input', (event) => {
        const value = event.target.value;
        if (isNaN(value)) {
            event.target.value = '';
        }
    });

    // Função para calcular o total de gastos do mês
    function calculateMonthlyExpenses() {
        const dailyExpenses = dailyChart.data.datasets[0].data;
        const totalMonthlyExpenses = dailyExpenses.reduce((acc, curr) => acc + curr, 0);
        return totalMonthlyExpenses;
    }

    // Função para exibir o relatório mensal
    function displayMonthlyReport() {
        const totalMonthlyExpenses = calculateMonthlyExpenses();
        monthlyReportElement.querySelector('#total-expenses').textContent = totalMonthlyExpenses;
    }

    // Função para atualizar os dados do gráfico diário e as sugestões
    function updateDataAndSuggestions(data) {
        updateDailyChartData(data);
        updateSuggestions(data);
        displayMonthlyReport();
    }

    // Event listener para atualizar o gráfico e as sugestões quando o botão de atualizar for clicado
    document.getElementById('update-chart').addEventListener('click', () => {
        const category1 = parseInt(document.getElementById('amount1').value) || 0;
        const category2 = parseInt(document.getElementById('amount2').value) || 0;
        const category3 = parseInt(document.getElementById('amount3').value) || 0;

        const data = [category1, category2, category3];
        updateDataAndSuggestions(data);
    });

});
