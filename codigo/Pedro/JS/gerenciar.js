document.addEventListener('DOMContentLoaded', function() {
    const calendar = document.getElementById('calendar');
    const expenseForm = document.getElementById('expense-form');
    const daySummary = document.getElementById('day-summary');
    const suggestionsList = document.getElementById('suggestions-list');
    const monthlyReport = document.getElementById('monthly-report');
    const settingsForm = document.getElementById('settings-form');
    const daySelector = document.getElementById('day-selector');
    const daySelectorForm = document.getElementById('day-selector-form');
    const selectDayInput = document.getElementById('select-day');
    
    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    function generateCalendar() {
        const daysInMonth = 31;
        for (let i = 1; i <= daysInMonth; i++) {
            let dayCard = document.createElement('div');
            dayCard.classList.add('day');
            let dayOfWeek = daysOfWeek[(i - 1) % 7];
            dayCard.textContent = `${dayOfWeek} ${i}`;
            dayCard.addEventListener('click', () => selectDay(dayOfWeek, i));
            calendar.appendChild(dayCard);
        }
    }

    function selectDay(dayOfWeek, day) {
        daySummary.innerHTML = `<h3>Gráfico de Gastos do Dia</h3>
                                <p>${dayOfWeek}, ${day}</p>
                                <img src="codigo\Pedro\img\grafico.png" alt="Gráfico de Gastos do Dia">`;
        expenseForm.date.value = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        selectDayInput.value = day;
    }

    function addExpense(event) {
        event.preventDefault();
        const date = expenseForm.date.value;
        const category = expenseForm.category.value;
        const amount = expenseForm.amount.value;
    }

    function loadSuggestions() {
        const suggestions = [
            'Evite compras por impulso.',
            'Planeje suas refeições.',
            'Use transporte público.',
            'Aproveite descontos e cupons.'
        ];

        suggestions.forEach(suggestion => {
            let p = document.createElement('p');
            p.textContent = suggestion;
            suggestionsList.appendChild(p);
        });
    }

    function saveSettings(event) {
        event.preventDefault();
        const budget = settingsForm.budget.value;
    }

    function toggleDaySelector(event) {
        if (!daySelectorForm.contains(event.target)) {
            if (daySelectorForm.style.display === 'none' || daySelectorForm.style.display === '') {
                daySelectorForm.style.display = 'block';
            } else {
                daySelectorForm.style.display = 'none';
            }
        }
    }
    daySelector.addEventListener('click', toggleDaySelector);
    expenseForm.addEventListener('submit', addExpense);
    settingsForm.addEventListener('submit', saveSettings);

    generateCalendar();
    loadSuggestions();
});
