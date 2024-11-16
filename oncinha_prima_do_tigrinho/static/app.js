let is_auto = false;
let intervalAuto = null;

const $btnAUTO = document.querySelector('#toggle-automatic');
const $betSelected = document.querySelector('select');
const $btnResetSaldo = document.querySelector('.reset-saldo');

// Atualiza o saldo na interface
const updateSaldo = (newBalance) => {
    document.querySelector('#player-saldo').innerText = `Saldo: R$ ${newBalance}`;
};

// Ação do botão girar
const girarRoleta = async () => {
    const bet_price = $betSelected.value;

    try {
        const r = await fetch(`/girar?bet_price=${bet_price}`, {
            method: 'POST',
        });

        if (r.status === 200) {
            const response = await r.json();
            console.log("Resposta do servidor:", response);

            // Atualiza a interface do jogo
            if (response.html) {
                document.querySelector('.game').innerHTML = response.html;

                // Reassociar o evento ao botão recriado
                const newBtnGirar = document.querySelector('.btn-girar');
                newBtnGirar.removeEventListener('click', girarRoleta); // Remove duplicatas
                newBtnGirar.addEventListener('click', girarRoleta);
            } else {
                console.error("HTML não retornado pelo servidor.");
            }

            // Atualiza o saldo
            if (response.new_balance !== undefined) {
                updateSaldo(response.new_balance);
            } else {
                console.error("Saldo não retornado pelo servidor.");
            }

            // Atualiza logs
            const logsList = document.querySelector('.logs ul');
            if (logsList) logsList.scrollIntoView(false);
        } else {
            console.warn("Erro na resposta do servidor. Reiniciando modo automático...");
            if (is_auto) {
                disableAuto();
                await resetSaldo();
                enableAuto();
            }
        }
    } catch (error) {
        console.error("Erro ao girar:", error);
    }
};

// Adiciona o evento ao botão no carregamento inicial
const $btnGirar = document.querySelector('.btn-girar');
$btnGirar.addEventListener('click', girarRoleta);

// Reseta o saldo do jogador
const resetSaldo = async () => {
    try {
        const r = await fetch(`/reset-saldo`);
        const response = await r.json();
        console.log("Reset saldo:", response);
        document.querySelector('#player-saldo').innerText = `Saldo: R$ ${response.saldo}`;
    } catch (error) {
        console.error("Erro ao resetar saldo:", error);
    }
};

// Ação do botão resetar saldo
$btnResetSaldo.addEventListener('click', async () => {
    await resetSaldo();
});

// Ação do botão sacar
const buttonSacar = document.querySelector('.button[href="/sacar"]');
buttonSacar.addEventListener('click', async (ev) => {
    ev.preventDefault(); // Evita o redirecionamento
    try {
        const r = await fetch('/sacar');
        const response = await r.text();
        document.body.innerHTML = response;
    } catch (error) {
        console.error("Erro ao sacar:", error);
    }
});

// Ativa o modo automático
const enableAuto = () => {
    is_auto = true;
    drawAuto();
    intervalAuto = setInterval(() => {
        $btnGirar.click();
    }, 1000);
};

// Desativa o modo automático
const disableAuto = () => {
    is_auto = false;
    drawAuto();
    clearInterval(intervalAuto);
};

// Alterna entre ativar/desativar automático
const toggleAuto = () => {
    if (is_auto) disableAuto();
    else enableAuto();
};

// Atualiza o texto do botão AUTO
const drawAuto = () => {
    $btnAUTO.innerText = is_auto ? 'STOP' : 'AUTO';
};

// Ação do botão AUTO
$btnAUTO.addEventListener('click', toggleAuto);
