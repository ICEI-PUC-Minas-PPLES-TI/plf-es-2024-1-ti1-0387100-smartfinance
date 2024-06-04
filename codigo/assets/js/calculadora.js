const display = document.getElementById("display");
const tabela_display = document.getElementById("anteriores");

// Função para procurar uma vírgula existente (regra para não ter duas vírgulas)
function procurar_virgula() {
    return display.value.includes(',');
}

// Função para pegar os valores inteiros no display (antes da vírgula)
function pegar_inteiros() {
    const valorSemPontos = display.value.replace(/\./g, ''); // Remove todos os pontos do valor
    const [parteInteira] = valorSemPontos.split(','); // Pega a parte inteira antes da vírgula
    return parteInteira.length;
}

// Função para pegar os valores decimais no display (depois da vírgula)
function pegar_decimais() {
    const [_, parteDecimal] = display.value.split(',');
    return parteDecimal ? parteDecimal.length : 0;
}

// Função para formatar o valor numérico usando Intl.NumberFormat
function formatar_valor() {
    const partes = display.value.split(',');
    let parteInteira = partes[0].replace(/\./g, ''); // Remove todos os pontos da parte inteira

    // Usa Intl.NumberFormat para adicionar pontos a cada três dígitos
    const parteInteiraFormatada = new Intl.NumberFormat('pt-BR').format(parteInteira);

    if (partes.length > 1) {
        display.value = `${parteInteiraFormatada},${partes[1]}`;
    } else {
        display.value = parteInteiraFormatada;
    }
}

// Função para adicionar um valor no display
function adicionar_valor(valor) {
    if (valor === ',' && procurar_virgula()) return; // Evita adicionar mais de uma vírgula
    if (display.value === '0' && valor !== ',') display.value = ''; // Remove o zero inicial

    display.value += valor;

    // Limitações para os números inteiros e decimais
    if (pegar_inteiros() > 10 || pegar_decimais() > 2) {
        display.value = display.value.slice(0, -1); // Remove o último caractere se ultrapassar o limite
        return;
    }

    formatar_valor();
}

// Função para limpar o display
function limparDisplay() {
    display.value = "";
}

// Função para limpar tudo
function limparTudo() {
    display.value = "";
    tabela_display.value = "";
}

// Função central para realizar cálculos
let tabela = [];
let ultimo_op = '';

function calcular(op) {
    if (!display.value) return; // Não faz nada se o display estiver vazio

    const valorAtual = parseFloat(display.value.replace(/\./g, '').replace(',', '.'));

    if (tabela.length === 0) {
        tabela.push(valorAtual);
        tabela_display.value += display.value + ' ' + op + ' ';
        limparDisplay();
        ultimo_op = op;
        return;
    }

    let res = tabela[0];
    switch (ultimo_op) {
        case '+':
            res += valorAtual;
            break;
        case '-':
            res -= valorAtual;
            break;
        case 'x':
            res *= valorAtual;
            break;
        case '/':
            if (valorAtual === 0) {
                alert("Erro: Divisão por zero não é permitida.");
                limparDisplay();
                return;
            }
            res /= valorAtual;
            break;
        case '%':
            res %= valorAtual;
            break;
        case '^':
            res = Math.pow(res, valorAtual);
            break;
        case 'root':
            res = Math.pow(valorAtual, 1 / res);
            break; // Troca o valorAtual com res
    }

    if (op === '=') {
        display.value = res.toLocaleString('pt-BR', { minimumFractionDigits: 0 });
        tabela_display.value = "";
        tabela = [];
    } else {
        tabela = [res];
        tabela_display.value += display.value + ' ' + op + ' ';
        limparDisplay();
    }

    ultimo_op = op;
}

// Função para calcular juros simples
function calcularJurosSimples() {
    const principal = parseFloat(document.getElementById("principalJurosSimples").value);
    const taxaJuros = parseFloat(document.getElementById("taxaJurosSimples").value);
    const periodo = parseFloat(document.getElementById("periodoJurosSimples").value);

    const juros = (principal * taxaJuros * periodo) / 100;
    const total = principal + juros;

    $('#jurosSimplesModal').modal('hide');
    $('#resultadoModal .modal-title').text('Resultado do Cálculo de Juros Simples');
    $('#resultadoModal .modal-body').html(`<p>O total a pagar é: ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>`);
    $('#resultadoModal').modal('show');
}

// Função para calcular juros compostos
function calcularJurosCompostos() {
    const principal = parseFloat(document.getElementById("principalJurosCompostos").value);
    const taxaJuros = parseFloat(document.getElementById("taxaJurosCompostos").value);
    const periodo = parseFloat(document.getElementById("periodoJurosCompostos").value);

    const total = principal * Math.pow((1 + taxaJuros / 100), periodo);

    $('#jurosCompostosModal').modal('hide');
    $('#resultadoModal .modal-title').text('Resultado do Cálculo de Juros Compostos');
    $('#resultadoModal .modal-body').html(`<p>O total a pagar é: ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>`);
    $('#resultadoModal').modal('show');
}

// Função para calcular pagamento mensal
function calcularPagamentoMensal() {
    const principal = parseFloat(document.getElementById("principalPagamentoMensal").value);
    const taxaJuros = parseFloat(document.getElementById("taxaJurosPagamentoMensal").value);
    const periodo = parseFloat(document.getElementById("periodoPagamentoMensal").value);

    const taxaMensal = taxaJuros / 100 / 12;
    const numeroPagamentos = periodo * 12;
    const pagamentoMensal = (principal * taxaMensal) / (1 - Math.pow((1 + taxaMensal), -numeroPagamentos));

    $('#pagamentoMensalModal').modal('hide');
    $('#resultadoModal .modal-title').text('Resultado do Cálculo de Pagamento Mensal');
    $('#resultadoModal .modal-body').html(`<p>O pagamento mensal é: ${pagamentoMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>`);
    $('#resultadoModal').modal('show');
}

// Função para calcular valor futuro
function calcularValorFuturo() {
    const principal = parseFloat(document.getElementById("principalValorFuturo").value);
    const contribuicaoMensal = parseFloat(document.getElementById("contribuicaoMensal").value);
    const taxaJuros = parseFloat(document.getElementById("taxaJurosValorFuturo").value);
    const periodo = parseFloat(document.getElementById("periodoValorFuturo").value);

    const taxaMensal = taxaJuros / 100 / 12;
    const numeroPagamentos = periodo * 12;
    const valorFuturo = principal * Math.pow(1 + taxaMensal, numeroPagamentos) + contribuicaoMensal * (Math.pow(1 + taxaMensal, numeroPagamentos) - 1) / taxaMensal;

    $('#valorFuturoModal').modal('hide');
    $('#resultadoModal .modal-title').text('Resultado do Cálculo do Valor Futuro');
    $('#resultadoModal .modal-body').html(`<p>O valor futuro é: ${valorFuturo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>`);
    $('#resultadoModal').modal('show');
}

// Função para calcular ROI
function calcularROI() {
    const ganho = parseFloat(document.getElementById("ganhoROI").value);
    const custo = parseFloat(document.getElementById("custoROI").value);

    const roi = ((ganho - custo) / custo) * 100;

    $('#roiModal').modal('hide');
    $('#resultadoModal .modal-title').text('Resultado do Cálculo do ROI');
    $('#resultadoModal .modal-body').html(`<p>O ROI é: ${roi.toFixed(2)}%</p>`);
    $('#resultadoModal').modal('show');
}

// Função para calcular APR
function calcularAPR() {
    const taxaJurosMensal = parseFloat(document.getElementById("taxaJurosAPR").value);

    const apr = ((Math.pow(1 + taxaJurosMensal / 100, 12) - 1) * 100);

    $('#aprModal').modal('hide');
    $('#resultadoModal .modal-title').text('Resultado do Cálculo do APR');
    $('#resultadoModal .modal-body').html(`<p>O APR é: ${apr.toFixed(2)}%</p>`);
    $('#resultadoModal').modal('show');
}

// Função para calcular TIR
function calcularTIR() {
    const cashFlowsInput = document.getElementById("cashFlowsTIR").value;
    const cashFlows = cashFlowsInput.split(',').map(value => parseFloat(value));

    let irr = 0.1;
    const precision = 1e-6;
    let npv;

    do {
        npv = cashFlows.reduce((acc, val, i) => acc + val / Math.pow((1 + irr), i), 0);
        irr += npv / 10000;
    } while (Math.abs(npv) > precision);

    $('#tirModal').modal('hide');
    $('#resultadoModal .modal-title').text('Resultado do Cálculo da TIR');
    $('#resultadoModal .modal-body').html(`<p>A TIR é: ${(irr * 100).toFixed(2)}%</p>`);
    $('#resultadoModal').modal('show');
}