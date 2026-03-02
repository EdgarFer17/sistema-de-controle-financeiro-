
function formatarDinheiro(valor) {
    return new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
    }).format(valor);
}

let saldoNoNavegador = localStorage.getItem('meuSaldoSalvo');
let meuValor;

if (saldoNoNavegador === null) {
    meuValor = 1000;
} else {
    meuValor = Number(saldoNoNavegador);
}


let extratoSalvo = localStorage.getItem('meuExtrato');
let historico = extratoSalvo === null ? [] : JSON.parse(extratoSalvo);



let valorTotal = document.getElementById('valorTotal');
if (valorTotal !== null) {

    valorTotal.textContent = formatarDinheiro(meuValor); 
}


let containerMovimentacoes = document.querySelector('.movimentacoes');
if (containerMovimentacoes !== null) {
    

    containerMovimentacoes.innerHTML = ''; 


    historico.forEach(transacao => {
        let div = document.createElement('div');
        div.classList.add('movimentacao');
        
        
        let cor = transacao.tipo === 'saque' ? 'red' : 'green';
        let sinal = transacao.tipo === 'saque' ? '-' : '+';

        div.innerHTML = `
            <div class="nome-estante">
                <span>${transacao.nome}</span>
                <span>${transacao.data}</span>
            </div>
            <span style="color: ${cor};">${sinal} ${formatarDinheiro(transacao.valor)}</span>
        `;
        
       
        containerMovimentacoes.prepend(div);
    });
}


function registrarTransacao(tipo, valor) {
    let dataAtual = new Date();
    
    let dataFormatada = dataAtual.toLocaleDateString('pt-BR') + ' ' + dataAtual.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});

    let novaTransacao = {
        nome: tipo === 'saque' ? 'Saque Realizado' : 'Depósito Recebido',
        data: dataFormatada,
        valor: valor,
        tipo: tipo 
    };

    
    historico.push(novaTransacao);
    localStorage.setItem('meuExtrato', JSON.stringify(historico));
}


function sacar() {
    let inputSaque = document.getElementById('sacarValor').value;
    let inputSenha = document.getElementById('senhaSaque').value;

    if (inputSaque) {
        if (inputSenha == 123) {
            let valorDoSaque = Number(inputSaque);

            if (meuValor < valorDoSaque) { 
                alert("Você não possui saldo suficiente!");
            } else {
                
                meuValor = meuValor - valorDoSaque;
                
                
                localStorage.setItem('meuSaldoSalvo', meuValor);
                
                
                registrarTransacao('saque', valorDoSaque);

                if (valorTotal !== null) {
                    valorTotal.textContent = formatarDinheiro(meuValor);
                }
                
                alert("Saque realizado com sucesso!!");
                window.location.href='./index.html';
            }
        } else if (!inputSenha) {
            alert("Adicione a senha para saque!");
        } else {
            alert("Senha incorreta!");
        }
    } else {
        alert("Adicione valor!");
    }    
}

function depositar() {
    let inputDeposito = document.getElementById('depositarValor').value;
    let inputChave = document.getElementById('chavePix').value;

    if (inputDeposito) {
        if (inputChave) {
            let valorDoDeposito = Number(inputDeposito);
            
            
            meuValor = meuValor + valorDoDeposito;
            
            
            localStorage.setItem('meuSaldoSalvo', meuValor);
            
            
            registrarTransacao('deposito', valorDoDeposito);

            if (valorTotal !== null) {
                valorTotal.textContent = formatarDinheiro(meuValor);
            }

            alert("Depósito realizado com sucesso!");
            window.location.href='./index.html';
            
        } else if (!inputChave) {
            alert("Adicione a chave para depósito!");
        } else {
            alert("Chave incorreta!");
        }
    } else {
        alert("Adicione valor!");
    }    
}

let totalEntradas = 0;
let totalSaidas = 0;

historico.forEach(transacao => {
    if (transacao.tipo === 'deposito') {
        
        totalEntradas = totalEntradas + transacao.valor;
    } else if (transacao.tipo === 'saque') {
        
        totalSaidas = totalSaidas + transacao.valor;
    }
});


/*------------------------Grafico extrato---------------------------------*/

document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('graficoDespesas');
    
    if (ctx) {
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Entradas', 'Saidas'],
                datasets: [{
                    label: 'Gastos (R$)',
                    data: [totalEntradas, totalSaidas],
                    backgroundColor: [
                        'green',
                        'red',
                    ],
                    hoverOffset: 10
                }]
            },
            options: {
                plugins: {
                    legend: { position: 'bottom' },
                    title: { display: true, text: 'Extrato de Gastos' }
                }
            }
        });
    }
});
/*-------------------------------------------------------------------*/

document.addEventListener('DOMContentLoaded', function() {
    const ctxInv = document.getElementById('graficoEvolucaoInvestimentos');
    new Chart(ctxInv, {
        type: 'bar', 
        data: {
            labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'], 
            datasets: [
                {
                label: 'Renda CDB',
                data: [200, 223.50, 248.00, 271.20, 295.80, 320.10, 345.50, 370.00, 395.30, 421.00, 445.50, 472.00], 
                backgroundColor: '#0fb3c9', 
            },
            {
                label: 'XPML11',
                data: [150, 168.20, 186.50, 205.10, 222.80, 241.00, 259.30, 278.50, 296.00, 315.20, 334.00, 352.50], 
                backgroundColor: '#026fec', 
            },
            {
                label: 'KNCR11',               
                data: [120, 132.50, 145.20, 158.80, 171.00, 184.30, 197.50, 210.20, 223.80, 237.10, 251.50, 265.00], 
                backgroundColor: '#01202c', 
            },
            {
                label: 'HSML11',     
                data: [100, 115.30, 131.00, 146.50, 162.20, 178.00, 194.50, 210.10, 226.40, 242.80, 259.00, 275.50], 
                backgroundColor: '#00be6f', 
            }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    
    const ctxAcoes = document.getElementById('graficoPerformanceAcoes');
    new Chart(ctxAcoes, {
        type: 'line', 
        data: {
            labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            datasets: [{
                label: 'Carteira de Ações (Valor Total)',
                data: [5000, 5200, 5600,5000, 5700, 6200, 5800, 6100, 5900, 6200, 6120, 6450],
                borderColor: '#0fb3c9',
                backgroundColor: 'rgba(91, 142, 149, 0.2)', 
                fill: true,
                tension: 0.4 
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true }
            }
        }
    });
});