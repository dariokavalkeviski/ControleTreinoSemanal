const dadosOriginais = {
  A: [
    ['Supino Inclinado (Peito)', '3', '12', ''],
    ['Crucifixo (Peito)', '3', '12', ''],
    ['Supino Reto (Peito)', '3', '12', ''],
    ['Cross Over (Peito)', '3', '12', ''],
    ['Desenvolvimento (Ombro)', '3', '12', ''],
    ['Elevação Frontal (Ombro)', '3', '12', ''],
    ['Elevação Lateral (Ombro)', '3', '12', ''],
    ['Polia (Tríceps)', '3', '12', ''],
    ['Francês (Tríceps)', '3', '12', ''],
    ['Banco (Tríceps)', '3', '12', '—'],
    ['Simulador Escada (Cardio)', '1', '10min', '—']
  ],
  B: [
    ['Puxada Aberta (Costas)', '3', '12', ''],
    ['Puxada Fechada (Costas)', '3', '12', ''],
    ['Remada unilateral (Costas)', '3', '12', ''],
    ['Remada Baixa (Costas)', '3', '12', ''],
    ['Pullôver (Costas)', '3', '12', ''],
    ['Rosca Scott Barra W (Bíceps)', '3', '12', ''],
    ['Martelo Corda (Bíceps)', '3', '12', ''],
    ['Rosca Alternada Neutra Sentado (Bíceps)', '3', '12', ''],
    ['Rosca Concentrada (Bíceps)', '3', '12', ''],
    ['Rosca Direta Barra W (Bíceps)', '3', '12', '—'],
    ['Elíptico (Cardio)', '1', '10min', '—']
  ],
  C: [
    ['Supino Reto (Peito)', '3', '12', ''],
    ['Remada (Peito)', '3', '12', ''],
    ['Desenvolvimento (Ombro)', '3', '12', ''],
    ['Rosca Direta (Bíceps)', '3', '12', ''],
    ['Polia (Tríceps)', '3', '12', ''],
    ['Elevação de Pernas (Abdômem)', '3', '15', ''],
    ['Extensora (Pernas)', '3', '15', ''],
    ['Flexora (Pernas)', '3', '15', '—'],
    ['Panturilha Sentado (Pernas)', '3', '15', '—'],
    ['Leg Press (Pernas)', '3', '15', ''],
    ['Simulador de escada (Cardio)', '1', '10min', '—']
  ]
};

const nomesTreino = {
  A: 'Treino A ',
  B: 'Treino B ',
  C: 'Treino C '
};

const container = document.getElementById('treinosContainer');

function criarTabela(treinoId, linhas) {
  const section = document.createElement('section');
  const h2 = document.createElement('h2');
  h2.textContent = nomesTreino[treinoId];
  section.appendChild(h2);

  const table = document.createElement('table');
  table.setAttribute('data-treino', treinoId);

  const thead = document.createElement('thead');
  thead.innerHTML = `<tr>
    <th>Exercício</th>
    <th>Séries</th>
    <th>Repetições</th>
    <th>Peso (kg)</th>
    <th>Ações</th>
  </tr>`;
  table.appendChild(thead);

  const tbody = document.createElement('tbody');

  linhas.forEach(celulas => {
    const tr = document.createElement('tr');
    celulas.forEach(texto => {
      const td = document.createElement('td');
      td.contentEditable = true;
      td.innerText = texto;
      tr.appendChild(td);
    });
    const tdAcao = document.createElement('td');
    const btn = document.createElement('button');
    btn.classList.add('btnConcluir');
    btn.textContent = 'Concluído';
    btn.onclick = () => {
      tr.remove();
      salvarEstado();
    };
    tdAcao.appendChild(btn);
    tr.appendChild(tdAcao);
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  section.appendChild(table);
  container.appendChild(section);
}

function salvarEstado() {
  const treinos = {};
  document.querySelectorAll('table[data-treino]').forEach(table => {
    const treinoId = table.getAttribute('data-treino');
    const linhas = [];
    table.querySelectorAll('tbody tr').forEach(tr => {
      const células = Array.from(tr.querySelectorAll('td[contenteditable="true"]'));
      if (células.length === 0) return;
      const valores = células.map(td => td.innerText.trim());
      linhas.push(valores);
    });
    treinos[treinoId] = linhas;
  });
  localStorage.setItem('planotreino', JSON.stringify(treinos));
}

function carregarEstado() {
  const data = localStorage.getItem('planotreino');
  return data ? JSON.parse(data) : null;
}

function construirTabelas() {
  container.innerHTML = '';

  const dadosSalvos = carregarEstado();

  for (const treinoId of Object.keys(dadosOriginais)) {
    const originais = dadosOriginais[treinoId];
    const salvos = dadosSalvos ? dadosSalvos[treinoId] || [] : [];

    const mapaSalvo = new Map();
    salvos.forEach((linhaEditada, idx) => {
      mapaSalvo.set(idx, linhaEditada);
    });

    const linhasParaExibir = originais.map((linhaOriginal, idx) => {
      return mapaSalvo.has(idx) ? mapaSalvo.get(idx) : linhaOriginal;
    });

    criarTabela(treinoId, linhasParaExibir);
  }

  adicionarListeners();
}

function removerLinha(botao) {
  const linha = botao.closest('tr');
  linha.remove();
  salvarEstado();
}

function adicionarListeners() {
  document.querySelectorAll('td[contenteditable="true"]').forEach(td => {
    td.removeEventListener('input', salvarEstado);
    td.addEventListener('input', salvarEstado);
  });
  document.querySelectorAll('.btnConcluir').forEach(btn => {
    btn.removeEventListener('click', event => removerLinha(event.target));
    btn.addEventListener('click', () => removerLinha(btn));
  });
}

function resetarTreino() {
  construirTabelas();
  alert('Linhas removidas foram repostas mantendo suas edições.');
}

document.getElementById('btnReset').addEventListener('click', resetarTreino);

window.onload = construirTabelas;
