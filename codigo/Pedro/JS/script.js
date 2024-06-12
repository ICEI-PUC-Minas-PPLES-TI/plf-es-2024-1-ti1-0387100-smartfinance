document.addEventListener('DOMContentLoaded', function() {
    const days = document.querySelectorAll('.day');
    const selectedDayElement = document.getElementById('selected-day');
    const suggestionsElement = document.getElementById('suggestions');
    const monthlyReportElement = document.getElementById('monthly-report');

    const dailyCtx = document.getElementById('dailyChart').getContext('2d');
    const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');

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

    let monthlyChart = new Chart(monthlyCtx, {
        type: 'pie',
        data: {
            labels: ['Categoria 1', 'Categoria 2', 'Categoria 3'],
            datasets: [{
                label: 'Total de Gastos',
                data: [0, 0, 0],
                backgroundColor: ['red', 'blue', 'green'],
                borderColor: ['red', 'blue', 'green'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });

    let dailyData = {};
    let totalMonthlyData = [0, 0, 0];
    let categoryNames = ['Categoria 1', 'Categoria 2', 'Categoria 3'];

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

    function updateMonthlyReport() {
        monthlyReportElement.querySelector('#total-expenses').textContent = totalMonthlyData.reduce((acc, curr) => acc + curr, 0);
        monthlyChart.data.labels = categoryNames;
        monthlyChart.data.datasets[0].data = totalMonthlyData;
        monthlyChart.update();
    }

    days.forEach(day => {
        day.addEventListener('click', () => {
            const selectedDay = day.textContent;
            selectedDayElement.textContent = selectedDay;

            if (!dailyData[selectedDay]) {
                dailyData[selectedDay] = [0, 0, 0];
            }
            updateDailyChartData(dailyData[selectedDay]);
            updateSuggestions(dailyData[selectedDay]);
        });
    });

    document.getElementById('update-chart').addEventListener('click', () => {
        const category1 = parseInt(document.getElementById('amount1').value) || 0;
        const category2 = parseInt(document.getElementById('amount2').value) || 0;
        const category3 = parseInt(document.getElementById('amount3').value) || 0;

        const category1Name = document.getElementById('category1').value || 'Categoria 1';
        const category2Name = document.getElementById('category2').value || 'Categoria 2';
        const category3Name = document.getElementById('category3').value || 'Categoria 3';

        categoryNames = [category1Name, category2Name, category3Name];

        const selectedDay = selectedDayElement.textContent;
        const data = [category1, category2, category3];
        dailyData[selectedDay] = data;

        totalMonthlyData = [0, 0, 0];
        for (let key in dailyData) {
            totalMonthlyData[0] += dailyData[key][0];
            totalMonthlyData[1] += dailyData[key][1];
            totalMonthlyData[2] += dailyData[key][2];
        }

        dailyChart.data.labels = categoryNames;
        updateDailyChartData(data);
        updateSuggestions(data);
        updateMonthlyReport();
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

});
