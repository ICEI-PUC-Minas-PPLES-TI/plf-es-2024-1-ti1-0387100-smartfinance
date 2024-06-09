function salvarEmail() {
    const email = document.getElementById("txtEmail").value;
    if (email) {
        const emailsAntigos = JSON.parse(localStorage.getItem("emails")) || [];
        emailsAntigos.push(email);
        localStorage.setItem("emails", JSON.stringify(emailsAntigos));
        atualizarLista();
        alert("E-mail salvo com sucesso!");
    } else {
        alert("Por favor, insira um e-mail válido.");
    }
}

function removerEmail(index) {
    const emails = JSON.parse(localStorage.getItem("emails")) || [];
    emails.splice(index, 1);
    localStorage.setItem("emails", JSON.stringify(emails));
    atualizarLista();
}

function editarEmail(index) {
    const novoEmail = prompt("Digite o novo e-mail:");
    if (novoEmail) {
        const emails = JSON.parse(localStorage.getItem("emails")) || [];
        emails[index] = novoEmail;
        localStorage.setItem("emails", JSON.stringify(emails));
        atualizarLista();
    }
}

function atualizarLista() {
    const emails = JSON.parse(localStorage.getItem("emails")) || [];
    const lista = document.getElementById("listaEmails");
    lista.innerHTML = "";
    emails.forEach((email, index) => {
        const li = document.createElement("li");
        li.textContent = email;
        const btnRemover = document.createElement("button");
        btnRemover.textContent = "Remover";
        btnRemover.onclick = () => removerEmail(index);
        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.onclick = () => editarEmail(index);
        li.appendChild(btnRemover);
        li.appendChild(btnEditar);
        lista.appendChild(li);
    });
}
atualizarLista();