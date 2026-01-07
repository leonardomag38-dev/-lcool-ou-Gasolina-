// ====== AO ABRIR O APP ======
window.onload = function() {
  carregarDados();
};

// ====== NAVEGAÇÃO ======
function irParaCalculadora() {
  mostrar("telaInicial", false);
  mostrar("telaCalculadora", true);
}

function voltarCalculadora() {
  mostrar("telaHistorico", false);
  mostrar("telaCalculadora", true);
}

function abrirHistorico() {
  carregarHistorico();
  mostrar("telaCalculadora", false);
  mostrar("telaHistorico", true);
}

function mostrar(id, status) {
  document.getElementById(id).classList.toggle("hidden", !status);
}

// ====== DADOS DO CARRO ======
function carregarDados() {
  ["alcool", "consumoAlcool", "gasolina", "consumoGasolina"].forEach(id => {
    const valor = localStorage.getItem(id);
    if (valor) document.getElementById(id).value = valor;
  });
}

function salvarDados(alcool, consumoAlcool, gasolina, consumoGasolina) {
  localStorage.setItem("alcool", alcool);
  localStorage.setItem("consumoAlcool", consumoAlcool);
  localStorage.setItem("gasolina", gasolina);
  localStorage.setItem("consumoGasolina", consumoGasolina);
}

// ====== HISTÓRICO ======
function salvarHistorico(registro) {
  let historico = JSON.parse(localStorage.getItem("historico")) || [];
  historico.unshift(registro);
  localStorage.setItem("historico", JSON.stringify(historico));
}

function carregarHistorico() {
  const lista = document.getElementById("listaHistorico");
  lista.innerHTML = "";
  
  const historico = JSON.parse(localStorage.getItem("historico")) || [];
  
  if (historico.length === 0) {
    lista.innerHTML = "<li>Nenhum cálculo registrado.</li>";
    return;
  }
  
  historico.forEach(item => {
    const li = document.createElement("li");
    li.innerText =
      `${item.data} — Álcool: R$ ${item.alcoolKm}/km | Gasolina: R$ ${item.gasolinaKm}/km → ${item.melhor}`;
    lista.appendChild(li);
  });
}

function limparHistorico() {
  localStorage.removeItem("historico");
  carregarHistorico();
}

// ====== CÁLCULO ======
function calcular() {
  const alcool = parseFloat(document.getElementById("alcool").value);
  const consumoAlcool = parseFloat(document.getElementById("consumoAlcool").value);
  const gasolina = parseFloat(document.getElementById("gasolina").value);
  const consumoGasolina = parseFloat(document.getElementById("consumoGasolina").value);
  const resultado = document.getElementById("resultado");
  
  if (
    !alcool || !gasolina ||
    !consumoAlcool || !consumoGasolina ||
    alcool <= 0 || gasolina <= 0 ||
    consumoAlcool <= 0 || consumoGasolina <= 0
  ) {
    resultado.innerText = "⚠️ Informe todos os valores corretamente.";
    return;
  }
  
  salvarDados(alcool, consumoAlcool, gasolina, consumoGasolina);
  
  const alcoolKm = (alcool / consumoAlcool).toFixed(2);
  const gasolinaKm = (gasolina / consumoGasolina).toFixed(2);
  
  let melhor = "Empate";
  if (alcoolKm < gasolinaKm) melhor = "Álcool";
  else if (gasolinaKm < alcoolKm) melhor = "Gasolina";
  
  resultado.innerText =
    `Álcool: R$ ${alcoolKm}/km\nGasolina: R$ ${gasolinaKm}/km\n👉 Melhor: ${melhor}`;
  
  salvarHistorico({
    data: new Date().toLocaleString(),
    alcoolKm,
    gasolinaKm,
    melhor
  });
}