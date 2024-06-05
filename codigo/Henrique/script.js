document.addEventListener('DOMContentLoaded', () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    let selectedIndex = -1;

    const dataList = document.getElementById('data-display');
    const nameInput = document.getElementById('name-input');
    const emailInput = document.getElementById('email-input');
    const dateInput = document.getElementById('date-input');
    const phoneInput = document.getElementById('phone-input');
    const userTypeInput = document.getElementById('user-type-input');
    const createButton = document.getElementById('create-button');
    const editButton = document.getElementById('edit-button');

    function saveUsers() {
        localStorage.setItem('users', JSON.stringify(users));
    }

    function clearForm() {
        nameInput.value = '';
        emailInput.value = '';
        dateInput.value = '';
        phoneInput.value = '';
        userTypeInput.value = '';
    }

    function displayUsers() {
        if (!dataList) return;

        dataList.innerHTML = '';
        users.forEach((user, index) => {
            const li = document.createElement('li');
            li.className = 'user-card';
            li.onclick = () => viewUserDetails(index);

            li.innerHTML = `
                <div class="user-info">
                    <p><strong>Nome:</strong> ${user.name}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Data de Entrada:</strong> ${user.date}</p>
                    <p><strong>Telefone:</strong> ${user.phone}</p>
                    <p><strong>Tipo de Usuário:</strong> ${user.type}</p>
                </div>
                <div class="actions">
                    <button class="edit-button" onclick="event.stopPropagation(); editUser(${index})">Editar</button>
                    <button class="delete-button" onclick="event.stopPropagation(); deleteUser(${index})">Excluir</button>
                </div>
            `;

            dataList.appendChild(li);
        });
    }

    createButton.addEventListener('click', () => {
        const user = {
            name: nameInput.value,
            email: emailInput.value,
            date: dateInput.value,
            phone: phoneInput.value,
            type: userTypeInput.value
        };

        if (user.name && user.email && user.date && user.phone && user.type) {
            if (selectedIndex === -1) {
                users.push(user);
            } else {
                users[selectedIndex] = user;
                selectedIndex = -1;
                createButton.textContent = 'Criar';
            }
            clearForm();
            saveUsers();
            displayUsers();
        }
    });

    editButton.addEventListener('click', () => {
        if (selectedIndex !== -1) {
            const user = {
                name: nameInput.value,
                email: emailInput.value,
                date: dateInput.value,
                phone: phoneInput.value,
                type: userTypeInput.value
            };

            if (user.name && user.email && user.date && user.phone && user.type) {
                users[selectedIndex] = user;
                selectedIndex = -1;
                createButton.textContent = 'Criar';
                clearForm();
                saveUsers();
                displayUsers();
            }
        }
    });

    window.editUser = (index) => {
        const user = users[index];
        nameInput.value = user.name;
        emailInput.value = user.email;
        dateInput.value = user.date;
        phoneInput.value = user.phone;
        userTypeInput.value = user.type;
        selectedIndex = index;
        createButton.textContent = 'Salvar';
    }

    window.deleteUser = (index) => {
        if (confirm('Você tem certeza que deseja deletar este usuário?')) {
            users.splice(index, 1);
            saveUsers();
            displayUsers();
        }
    }

    window.viewUserDetails = (index) => {
        localStorage.setItem('selectedUserIndex', index);
        window.location.href = 'user-details.html';
    }

    if (window.location.pathname.includes('user-details.html')) {
        const userInfo = document.getElementById('user-info');
        const userEditButton = document.getElementById('edit-button');
        const selectedUserIndex = localStorage.getItem('selectedUserIndex');

        if (selectedUserIndex !== null && users[selectedUserIndex]) {
            const user = users[selectedUserIndex];
            userInfo.innerHTML = `
                <p><strong>Nome:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Data de Entrada:</strong> ${user.date}</p>
                <p><strong>Telefone:</strong> ${user.phone}</p>
                <p><strong>Tipo de Usuário:</strong> ${user.type}</p>
            `;

            userEditButton.addEventListener('click', () => {
                localStorage.setItem('editUserIndex', selectedUserIndex);
                window.location.href = 'index.html';
            });
        } else {
            userInfo.innerHTML = '<p>Usuário não encontrado.</p>';
            userEditButton.style.display = 'none';
        }
    }

    displayUsers();
});
