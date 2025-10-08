const dadosOriginais = {
  A: [
    ["Supino Inclinado (Peito)", "3", "12", ""],
    ["Crucifixo (Peito)", "3", "12", ""],
    ["Supino Reto (Peito)", "3", "12", ""],
    ["Cross Over (Peito)", "3", "12", ""],
    ["Desenvolvimento (Ombro)", "3", "12", ""],
    ["Elevação Frontal (Ombro)", "3", "12", ""],
    ["Elevação Lateral (Ombro)", "3", "12", ""],
    ["Polia (Tríceps)", "3", "12", ""],
    ["Francês (Tríceps)", "3", "12", ""],
    ["Banco (Tríceps)", "3", "12", "—"],
    ["Simulador Escada (Cardio)", "1", "10min", "—"],
  ],
  B: [
    ["Puxada Aberta (Costas)", "3", "12", ""],
    ["Puxada Fechada (Costas)", "3", "12", ""],
    ["Remada unilateral (Costas)", "3", "12", ""],
    ["Remada Baixa (Costas)", "3", "12", ""],
    ["Pullôver (Costas)", "3", "12", ""],
    ["Rosca Scott Barra W (Bíceps)", "3", "12", ""],
    ["Martelo Corda (Bíceps)", "3", "12", ""],
    ["Rosca Alternada Neutra Sentado (Bíceps)", "3", "12", ""],
    ["Rosca Concentrada (Bíceps)", "3", "12", ""],
    ["Rosca Direta Barra W (Bíceps)", "3", "12", "—"],
    ["Elíptico (Cardio)", "1", "10min", "—"],
  ],
  C: [
    ["Supino Reto (Peito)", "3", "12", ""],
    ["Remada (Peito)", "3", "12", ""],
    ["Desenvolvimento (Ombro)", "3", "12", ""],
    ["Rosca Direta (Bíceps)", "3", "12", ""],
    ["Polia (Tríceps)", "3", "12", ""],
    ["Elevação de Pernas (Abdômem)", "3", "15", ""],
    ["Extensora (Pernas)", "3", "15", ""],
    ["Flexora (Pernas)", "3", "15", "—"],
    ["Panturilha Sentado (Pernas)", "3", "15", "—"],
    ["Leg Press (Pernas)", "3", "15", ""],
    ["Simulador de escada (Cardio)", "1", "10min", "—"],
  ],
};

const nomesTreino = {
  A: "Treino A ",
  B: "Treino B ",
  C: "Treino C ",
};

const container = document.getElementById("treinosContainer");

function criarTabela(treinoId, linhas) {
  const section = document.createElement("section");

  // Container para título e botão
  const headerContainer = document.createElement("div");
  headerContainer.style.display = "flex";
  headerContainer.style.justifyContent = "space-between";
  headerContainer.style.alignItems = "center";
  headerContainer.style.marginBottom = "10px";

  const h2 = document.createElement("h2");
  h2.innerHTML = `${nomesTreino[treinoId]}`;
  h2.style.margin = "0";;

  const btnReset = document.createElement("button");
  btnReset.textContent = "Resetar";
  btnReset.id = `btnReset${treinoId}`;
  btnReset.style.fontSize = "0.9rem";
  btnReset.style.padding = "5px 12px";
  btnReset.onclick = () => resetarTreinoIndividual(treinoId);

  headerContainer.appendChild(h2);
  headerContainer.appendChild(btnReset);
  section.appendChild(headerContainer);

  const table = document.createElement("table");
  table.setAttribute("data-treino", treinoId);

  const thead = document.createElement("thead");
  thead.innerHTML = `<tr>
    <th>Exercício</th>
    <th>Séries</th>
    <th>Repetições</th>
    <th>Peso (kg)</th>
    <th>Ações</th>
  </tr>`;
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  linhas.forEach((celulas) => {
    const tr = document.createElement("tr");
    celulas.forEach((texto) => {
      const td = document.createElement("td");
      td.contentEditable = true;
      td.innerText = texto;
      tr.appendChild(td);
    });
    const tdAcao = document.createElement("td");
    const btn = document.createElement("button");
    btn.classList.add("btnConcluir");
    btn.textContent = "Concluído";
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
  document.querySelectorAll("table[data-treino]").forEach((table) => {
    const treinoId = table.getAttribute("data-treino");
    const linhas = [];
    table.querySelectorAll("tbody tr").forEach((tr) => {
      const células = Array.from(
        tr.querySelectorAll('td[contenteditable="true"]')
      );
      if (células.length === 0) return;
      const valores = células.map((td) => td.innerText.trim());
      linhas.push(valores);
    });
    treinos[treinoId] = linhas;
  });
  localStorage.setItem("planotreino", JSON.stringify(treinos));
}

function carregarEstado() {
  const data = localStorage.getItem("planotreino");
  return data ? JSON.parse(data) : null;
}

function construirTabelas() {
  container.innerHTML = "";

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
  const linha = botao.closest("tr");
  linha.remove();
  salvarEstado();
}

function adicionarListeners() {
  document.querySelectorAll('td[contenteditable="true"]').forEach((td) => {
    td.removeEventListener("input", salvarEstado);
    td.addEventListener("input", salvarEstado);
  });
  document.querySelectorAll(".btnConcluir").forEach((btn) => {
    btn.removeEventListener("click", (event) => removerLinha(event.target));
    btn.addEventListener("click", () => removerLinha(btn));
  });
}

function resetarTreinoIndividual(treinoId) {
  if (confirm(`Tem certeza que deseja resetar o ${nomesTreino[treinoId]}?`)) {
    const dadosSalvos = carregarEstado();
    if (dadosSalvos && dadosSalvos[treinoId]) {
      delete dadosSalvos[treinoId];
      localStorage.setItem("planotreino", JSON.stringify(dadosSalvos));
    }

    // Reconstruir apenas a tabela específica
    const table = document.querySelector(`table[data-treino="${treinoId}"]`);
    if (table) {
      const section = table.closest("section");
      if (section) {
        section.remove();
      }
    }

    // Criar nova tabela com dados originais
    criarTabela(treinoId, dadosOriginais[treinoId]);
    adicionarListeners();

    alert(`${nomesTreino[treinoId]} foi resetado com sucesso!`);
  }
}

function resetarTreino() {
  if (confirm("Tem certeza que deseja resetar TODOS os treinos?")) {
    localStorage.removeItem("planotreino");
    construirTabelas();
    alert("Todos os treinos foram resetados com sucesso!");
  }
}

window.onload = construirTabelas;

// ==================== FUNCIONALIDADES IMC ====================

// Dados de classificação do IMC
const classificacoesIMC = {
  abaixoPeso: { min: 0, max: 18.5, nome: "Abaixo do peso", cor: "abaixo-peso" },
  normal: { min: 18.5, max: 25, nome: "Peso normal", cor: "normal" },
  sobrepeso: { min: 25, max: 30, nome: "Sobrepeso", cor: "sobrepeso" },
  obesidade1: {
    min: 30,
    max: 35,
    nome: "Obesidade Grau I",
    cor: "obesidade-1",
  },
  obesidade2: {
    min: 35,
    max: 40,
    nome: "Obesidade Grau II",
    cor: "obesidade-2",
  },
  obesidade3: {
    min: 40,
    max: 999,
    nome: "Obesidade Grau III",
    cor: "obesidade-3",
  },
};

// Recomendações baseadas no IMC
const recomendacoes = {
  abaixoPeso: [
    "Consulte um nutricionista para ganho de peso saudável",
    "Inclua exercícios de força para ganho de massa muscular",
    "Aumente a ingestão calórica com alimentos nutritivos",
    "Faça refeições menores e mais frequentes",
  ],
  normal: [
    "Mantenha uma alimentação equilibrada e variada",
    "Continue com exercícios regulares",
    "Monitore seu peso periodicamente",
    "Mantenha hábitos saudáveis de vida",
  ],
  sobrepeso: [
    "Reduza a ingestão calórica gradualmente",
    "Aumente a atividade física regular",
    "Prefira alimentos integrais e naturais",
    "Beba bastante água durante o dia",
  ],
  obesidade1: [
    "Procure orientação médica e nutricional",
    "Inicie um programa de exercícios supervisionado",
    "Reduza alimentos processados e açúcares",
    "Estabeleça metas realistas de perda de peso",
  ],
  obesidade2: [
    "Busque acompanhamento médico especializado",
    "Considere programas de reeducação alimentar",
    "Inicie exercícios de baixo impacto",
    "Monitore sua saúde regularmente",
  ],
  obesidade3: [
    "Procure imediatamente acompanhamento médico",
    "Considere tratamentos especializados",
    "Inicie atividades físicas com supervisão médica",
    "Priorize sua saúde e bem-estar",
  ],
};

// Função para calcular IMC
function calcularIMC(peso, altura) {
  if (peso <= 0 || altura <= 0) return null;
  return peso / (altura * altura);
}

// Função para classificar IMC
function classificarIMC(imc) {
  for (const [key, classificacao] of Object.entries(classificacoesIMC)) {
    if (imc >= classificacao.min && imc < classificacao.max) {
      return { key, ...classificacao };
    }
  }
  return null;
}

// Função para obter recomendações
function obterRecomendacoes(classificacao) {
  return recomendacoes[classificacao] || [];
}

// Função para salvar medição no histórico
function salvarMedicao(nome, peso, altura, imc, classificacao) {
  const historico = obterHistorico();
  const novaMedicao = {
    id: Date.now(),
    nome: nome,
    peso: peso,
    altura: altura,
    imc: imc,
    classificacao: classificacao.nome,
    data: new Date().toLocaleDateString("pt-BR"),
    timestamp: Date.now(),
  };

  historico.push(novaMedicao);
  localStorage.setItem("historicoIMC", JSON.stringify(historico));
  return novaMedicao;
}

// Função para obter histórico
function obterHistorico() {
  const historico = localStorage.getItem("historicoIMC");
  return historico ? JSON.parse(historico) : [];
}

// Função para limpar histórico
function limparHistorico() {
  localStorage.removeItem("historicoIMC");
  document.getElementById("imcHistory").style.display = "none";
}

// Função para exibir resultado do IMC
function exibirResultado(nome, peso, altura, imc, classificacao) {
  const resultDiv = document.getElementById("imcResult");
  const imcValue = document.getElementById("imcValue");
  const imcClassification = document.getElementById("imcClassification");
  const imcRecommendations = document.getElementById("imcRecommendations");

  // Exibir valor do IMC
  imcValue.textContent = imc.toFixed(1);

  // Exibir classificação
  imcClassification.textContent = classificacao.nome;
  imcClassification.className = `imc-classification ${classificacao.cor}`;

  // Exibir recomendações
  const recomendacoes = obterRecomendacoes(classificacao.key);
  imcRecommendations.innerHTML = `
    <h4>💡 Recomendações para ${nome}:</h4>
    <ul>
      ${recomendacoes.map((rec) => `<li>${rec}</li>`).join("")}
    </ul>
  `;

  resultDiv.style.display = "block";
}

// Função para criar gráfico melhorado
function criarGrafico(historico) {
  const canvas = document.getElementById("imcChart");
  const ctx = canvas.getContext("2d");

  if (historico.length === 0) {
    // Background com gradiente
    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height
    );
    gradient.addColorStop(0, "#2f2b23");
    gradient.addColorStop(1, "#3a2f0f");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#f2cc8f";
    ctx.font = "18px 'Segoe UI', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      "📊 Nenhum dado para exibir",
      canvas.width / 2,
      canvas.height / 2 - 10
    );
    ctx.font = "14px 'Segoe UI', Arial, sans-serif";
    ctx.fillStyle = "#bb9457";
    ctx.fillText(
      "Faça algumas medições para ver o gráfico",
      canvas.width / 2,
      canvas.height / 2 + 15
    );
    return;
  }

  // Limpar canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Configurações do gráfico
  const padding = 60;
  const chartWidth = canvas.width - 2 * padding;
  const chartHeight = canvas.height - 2 * padding;

  // Encontrar valores mínimos e máximos
  const valoresIMC = historico.map((h) => h.imc);
  const minIMC = Math.min(...valoresIMC) - 3;
  const maxIMC = Math.max(...valoresIMC) + 3;

  // Desenhar fundo com gradiente
  const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bgGradient.addColorStop(0, "rgba(47, 43, 35, 0.3)");
  bgGradient.addColorStop(1, "rgba(60, 56, 47, 0.3)");
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Função para obter cor baseada no IMC
  function obterCorIMC(imc) {
    if (imc < 18.5) return "#4a90e2"; // Azul - Abaixo do peso
    if (imc < 25) return "#7ed321"; // Verde - Normal
    if (imc < 30) return "#f5a623"; // Laranja - Sobrepeso
    if (imc < 35) return "#d0021b"; // Vermelho - Obesidade I
    if (imc < 40) return "#9013fe"; // Roxo - Obesidade II
    return "#000000"; // Preto - Obesidade III
  }

  // Função para obter nome da classificação
  function obterClassificacao(imc) {
    if (imc < 18.5) return "Abaixo do peso";
    if (imc < 25) return "Peso normal";
    if (imc < 30) return "Sobrepeso";
    if (imc < 35) return "Obesidade I";
    if (imc < 40) return "Obesidade II";
    return "Obesidade III";
  }

  // Desenhar áreas de classificação do IMC
  const faixasIMC = [
    {
      min: 0,
      max: 18.5,
      cor: "rgba(74, 144, 226, 0.1)",
      nome: "Abaixo do peso",
    },
    { min: 18.5, max: 25, cor: "rgba(126, 211, 33, 0.1)", nome: "Peso normal" },
    { min: 25, max: 30, cor: "rgba(245, 166, 35, 0.1)", nome: "Sobrepeso" },
    { min: 30, max: 35, cor: "rgba(208, 2, 27, 0.1)", nome: "Obesidade I" },
    { min: 35, max: 40, cor: "rgba(144, 19, 254, 0.1)", nome: "Obesidade II" },
    { min: 40, max: 100, cor: "rgba(0, 0, 0, 0.1)", nome: "Obesidade III" },
  ];

  faixasIMC.forEach((faixa) => {
    if (faixa.min >= minIMC && faixa.max <= maxIMC) {
      const yMin =
        canvas.height -
        padding -
        ((faixa.min - minIMC) / (maxIMC - minIMC)) * chartHeight;
      const yMax =
        canvas.height -
        padding -
        ((faixa.max - minIMC) / (maxIMC - minIMC)) * chartHeight;

      ctx.fillStyle = faixa.cor;
      ctx.fillRect(
        padding,
        Math.max(yMin, yMax),
        chartWidth,
        Math.abs(yMax - yMin)
      );
    }
  });

  // Desenhar eixos principais
  ctx.strokeStyle = "#bb9457";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, canvas.height - padding);
  ctx.lineTo(canvas.width - padding, canvas.height - padding);
  ctx.stroke();

  // Desenhar linhas de referência do IMC
  const linhasReferencia = [18.5, 25, 30, 35, 40];
  ctx.strokeStyle = "#bb9457";
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);

  linhasReferencia.forEach((imcRef) => {
    if (imcRef >= minIMC && imcRef <= maxIMC) {
      const y =
        canvas.height -
        padding -
        ((imcRef - minIMC) / (maxIMC - minIMC)) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }
  });

  ctx.setLineDash([]);

  // Desenhar área do gráfico
  ctx.beginPath();
  ctx.moveTo(padding, canvas.height - padding);

  historico.forEach((medicao, index) => {
    const x =
      padding + (index / Math.max(historico.length - 1, 1)) * chartWidth;
    const y =
      canvas.height -
      padding -
      ((medicao.imc - minIMC) / (maxIMC - minIMC)) * chartHeight;

    if (index === 0) {
      ctx.lineTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.lineTo(padding + chartWidth, canvas.height - padding);
  ctx.closePath();

  // Criar gradiente para a área
  const areaGradient = ctx.createLinearGradient(
    0,
    padding,
    0,
    canvas.height - padding
  );
  areaGradient.addColorStop(0, "rgba(242, 204, 143, 0.3)");
  areaGradient.addColorStop(1, "rgba(187, 148, 87, 0.1)");
  ctx.fillStyle = areaGradient;
  ctx.fill();

  // Desenhar linha principal do IMC
  ctx.strokeStyle = "#f2cc8f";
  ctx.lineWidth = 3;
  ctx.beginPath();

  historico.forEach((medicao, index) => {
    const x =
      padding + (index / Math.max(historico.length - 1, 1)) * chartWidth;
    const y =
      canvas.height -
      padding -
      ((medicao.imc - minIMC) / (maxIMC - minIMC)) * chartHeight;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  // Desenhar pontos com cores baseadas na classificação
  historico.forEach((medicao, index) => {
    const x =
      padding + (index / Math.max(historico.length - 1, 1)) * chartWidth;
    const y =
      canvas.height -
      padding -
      ((medicao.imc - minIMC) / (maxIMC - minIMC)) * chartHeight;

    // Círculo externo
    ctx.fillStyle = obterCorIMC(medicao.imc);
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, 2 * Math.PI);
    ctx.fill();

    // Círculo interno
    ctx.fillStyle = "#f2cc8f";
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fill();

    // Tooltip simples (mostra valor quando próximo do mouse)
    if (historico.length <= 10) {
      ctx.fillStyle = "#2f2b23";
      ctx.font = "11px 'Segoe UI', Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(medicao.imc.toFixed(1), x, y - 15);
    }
  });

  // Adicionar labels e legendas
  ctx.fillStyle = "#f2cc8f";
  ctx.font = "14px 'Segoe UI', Arial, sans-serif";
  ctx.textAlign = "center";

  // Título do gráfico
  ctx.font = "bold 16px 'Segoe UI', Arial, sans-serif";
  ctx.fillText("📈 Evolução do IMC", canvas.width / 2, 25);

  // Label do eixo X
  ctx.font = "12px 'Segoe UI', Arial, sans-serif";
  ctx.fillText(
    "Medições ao longo do tempo",
    canvas.width / 2,
    canvas.height - 10
  );

  // Label do eixo Y
  ctx.save();
  ctx.translate(20, canvas.height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText("IMC (kg/m²)", 0, 0);
  ctx.restore();

  // Valores do eixo Y
  ctx.textAlign = "right";
  ctx.font = "11px 'Segoe UI', Arial, sans-serif";
  ctx.fillText(maxIMC.toFixed(1), padding - 15, padding + 5);
  ctx.fillText(minIMC.toFixed(1), padding - 15, canvas.height - padding + 5);

  // Linhas de referência com labels
  linhasReferencia.forEach((imcRef) => {
    if (imcRef >= minIMC && imcRef <= maxIMC) {
      const y =
        canvas.height -
        padding -
        ((imcRef - minIMC) / (maxIMC - minIMC)) * chartHeight;
      ctx.fillText(imcRef.toString(), padding - 15, y + 4);
    }
  });

  // Legenda das faixas
  const legendaX = canvas.width - 120;
  const legendaY = padding + 10;

  ctx.font = "bold 12px 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = "#f2cc8f";
  ctx.textAlign = "left";
  ctx.fillText("Faixas IMC:", legendaX, legendaY);

  ctx.font = "10px 'Segoe UI', Arial, sans-serif";
  let legendaOffset = legendaY + 20;

  faixasIMC.forEach((faixa) => {
    ctx.fillStyle = faixa.cor.replace("0.1", "0.8");
    ctx.fillRect(legendaX, legendaOffset - 8, 12, 8);
    ctx.fillStyle = "#f4f1de";
    ctx.fillText(faixa.nome, legendaX + 18, legendaOffset);
    legendaOffset += 15;
  });
}

// Função para exibir histórico
function exibirHistorico() {
  const historico = obterHistorico();
  const historyDiv = document.getElementById("imcHistory");
  const historyTable = document.getElementById("historyTable");

  if (historico.length === 0) {
    historyDiv.style.display = "none";
    return;
  }

  // Criar tabela do histórico
  historyTable.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Data</th>
          <th>Nome</th>
          <th>Peso (kg)</th>
          <th>Altura (m)</th>
          <th>IMC</th>
          <th>Classificação</th>
        </tr>
      </thead>
      <tbody>
        ${historico
          .slice(-10)
          .reverse()
          .map(
            (medicao) => `
          <tr>
            <td>${medicao.data}</td>
            <td>${medicao.nome}</td>
            <td>${medicao.peso}</td>
            <td>${medicao.altura}</td>
            <td>${medicao.imc.toFixed(1)}</td>
            <td>${medicao.classificacao}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;

  // Criar gráfico
  criarGrafico(historico.slice(-10));

  historyDiv.style.display = "block";
}

// Função principal para calcular IMC
function processarCalculoIMC() {
  const nome = document.getElementById("nomeUsuario").value.trim();
  const peso = parseFloat(document.getElementById("pesoUsuario").value);
  const altura = parseFloat(document.getElementById("alturaUsuario").value);

  // Validações
  if (!nome) {
    alert("Por favor, digite seu nome.");
    return;
  }

  if (!peso || peso <= 0) {
    alert("Por favor, digite um peso válido.");
    return;
  }

  if (!altura || altura <= 0) {
    alert("Por favor, digite uma altura válida.");
    return;
  }

  // Calcular IMC
  const imc = calcularIMC(peso, altura);
  const classificacao = classificarIMC(imc);

  if (!classificacao) {
    alert("Erro ao calcular IMC. Verifique os valores inseridos.");
    return;
  }

  // Exibir resultado
  exibirResultado(nome, peso, altura, imc, classificacao);

  // Salvar no histórico
  salvarMedicao(nome, peso, altura, imc, classificacao);

  // Atualizar histórico
  exibirHistorico();

  // Limpar formulário
  document.getElementById("nomeUsuario").value = "";
  document.getElementById("pesoUsuario").value = "";
  document.getElementById("alturaUsuario").value = "";
}

// Event listeners para IMC
document.addEventListener("DOMContentLoaded", function () {
  // Botão calcular IMC
  const btnCalcularIMC = document.getElementById("btnCalcularIMC");
  if (btnCalcularIMC) {
    btnCalcularIMC.addEventListener("click", processarCalculoIMC);
  }

  // Botão limpar histórico
  const btnLimparHistorico = document.getElementById("btnLimparHistorico");
  if (btnLimparHistorico) {
    btnLimparHistorico.addEventListener("click", function () {
      if (confirm("Tem certeza que deseja limpar todo o histórico de IMC?")) {
        limparHistorico();
      }
    });
  }

  // Permitir calcular com Enter
  const inputsIMC = ["nomeUsuario", "pesoUsuario", "alturaUsuario"];
  inputsIMC.forEach((inputId) => {
    const input = document.getElementById(inputId);
    if (input) {
      input.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          processarCalculoIMC();
        }
      });
    }
  });

  // Carregar histórico ao inicializar
  exibirHistorico();
});
