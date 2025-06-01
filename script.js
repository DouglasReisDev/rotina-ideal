
function dataSelecionadaOuHoje() {
  const input = document.getElementById("dataSelecionada");
  return input && input.value ? input.value : new Date().toISOString().split('T')[0];
}

function mostrarAba(id) {
  document.querySelectorAll('.aba').forEach(aba => aba.classList.remove('ativa'));
  document.getElementById(id).classList.add('ativa');
}

function salvarCheckbox(chave, valor) {
  localStorage.setItem(chave, valor);
  salvarProgressoDiario();
  gerarCalendario();
}

function salvarProgressoDiario() {
  const data = dataSelecionadaOuHoje();
  const checkboxes = document.querySelectorAll('#rotina input[type="checkbox"], #dieta input[type="checkbox"]');
  const total = checkboxes.length + 1; // 1 = hidratação
  let feitos = 0;

  checkboxes.forEach(cb => { if (cb.checked) feitos++; });

  const agua = parseInt(localStorage.getItem("agua") || 0);
  if (agua >= 3) feitos++;

  const porcentagem = Math.round((feitos / total) * 100);
  localStorage.setItem("progresso_" + data, porcentagem);
}

function atualizarDataSelecionada() {
  salvarProgressoDiario();
  carregarRotina();
  gerarCalendario();
}

function carregarRotina() {
  const dataStr = dataSelecionadaOuHoje();
  const data = new Date(dataStr + 'T00:00:00');
  const diaSemana = data.getDay(); // 0 = domingo, 6 = sábado

 const rotina = (diaSemana === 0 || diaSemana === 6)
  ? ['Acordar 8h', 'Café dentro da dieta','Estudo aprofundado', 'Almoço dentro da dieta', 'Lazer/filme', 'Treino leve', 'refeição dentro da dieta', 'Relaxar']
  : ['Acordar 5h', 'Sair de casa no horario', 'Ir ao trabalho','café da manhã dentro da dieta as 8h','fruta ou iogurte as 11 ', 'Almoço', 'Voltar do trabalho', 'Treinar', 'Estudar', 'Dormir antes das 23h'];

  const secao = document.getElementById("rotina");
  secao.innerHTML = '<h2>Checklist de Rotina</h2>';

  rotina.forEach((item, i) => {
    const chave = `rotina_${dataStr}_${i}`;
    const checked = localStorage.getItem(chave) === 'true' ? 'checked' : '';
    secao.innerHTML += `
      <div class="bloco">
        <label><input type="checkbox" ${checked} onchange="salvarCheckbox('${chave}', this.checked)">${item}</label>
      </div>
    `;
  });
}


function carregarDieta() {
  const dieta = [
    '08:00 - Café da manhã - Seguindo a Dieta ',
    '11:00 - Lanche da manhã - Seguindo a dieta',
    '13:00 - Almoço - Seguindo a dieta',
    '17:00 - Café da tarde seguindo a dieta',
    '21:30 - Jantar - Seguindo a dieta'
  ];
  const container = document.getElementById("dietaLista");
  container.innerHTML = '';
  dieta.forEach((item, i) => {
    const chave = 'dieta_' + i;
    const checked = localStorage.getItem(chave) === 'true' ? 'checked' : '';
    container.innerHTML += `<div class="bloco"><label><input type="checkbox" ${checked} onchange="salvarCheckbox('${chave}', this.checked)">${item}</label></div>`;
  });
}

function ajustarAgua(delta) {
  let atual = parseInt(localStorage.getItem("agua") || 0);
  atual = Math.max(0, atual + delta);
  localStorage.setItem("agua", atual);
  document.getElementById("contadorAgua").textContent = atual + " L";
  salvarProgressoDiario();
  gerarCalendario();
}

function carregarAgua() {
  let atual = parseInt(localStorage.getItem("agua") || 0);
  document.getElementById("contadorAgua").textContent = atual + " L";
}

let dataAtual = new Date();

function gerarCalendario() {
  const dias = document.getElementById("dias");
  dias.innerHTML = "";
  const ano = dataAtual.getFullYear();
  const mes = dataAtual.getMonth();
  const primeiroDia = new Date(ano, mes, 1).getDay();
  const totalDias = new Date(ano, mes + 1, 0).getDate();
  const mesAno = document.getElementById("mesAno");
  mesAno.textContent = dataAtual.toLocaleString('default', { month: 'long' }) + ' ' + ano;

  for (let i = 0; i < primeiroDia; i++) {
    dias.innerHTML += '<div></div>';
  }
  for (let dia = 1; dia <= totalDias; dia++) {
    const data = `${ano}-${String(mes+1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    const progresso = localStorage.getItem("progresso_" + data) || "0";
    dias.innerHTML += `<div class="dia">${dia}<span>${progresso}%</span></div>`;
  }

  carregarRotina();
}




function mudarMes(offset) {
  dataAtual.setMonth(dataAtual.getMonth() + offset);
  gerarCalendario();
}

window.onload = () => {
  carregarRotina();
  carregarDieta();
  carregarAgua();
  salvarProgressoDiario();
  gerarCalendario();
};
