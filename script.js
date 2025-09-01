const usuarios = [
  { username: "editor", password: "123", role: "editor" },
  { username: "leitor", password: "123", role: "leitor" }
];

let noticias = [
  {
    titulo: "Brasil conquista medalha de ouro no vôlei nas Olimpíadas",
    texto: "A seleção brasileira masculina de vôlei venceu a final contra a Polônia por 3 sets a 1 e garantiu o ouro nas Olimpíadas de Paris 2024. O destaque da partida foi o oposto Alan, que marcou 28 pontos.",
    imagem: "https://agenciabrasil.ebc.com.br/sites/default/files/thumbnails/image/volei_brasil_ouro.jpg",
    categoria: "esportes"
  },
  {
    titulo: "Inflação no Brasil desacelera em agosto e fecha em 0,12%",
    texto: "O IPCA de agosto registrou alta de 0,12%, segundo o IBGE. O resultado foi puxado pela queda nos preços dos combustíveis e alimentos. No acumulado de 12 meses, a inflação está em 4,6%.",
    imagem: "https://s2.glbimg.com/infla_brasil.jpg",
    categoria: "economia"
  },
  {
    titulo: "Câmara aprova novo marco legal da inteligência artificial",
    texto: "O projeto de lei que regulamenta o uso de inteligência artificial no Brasil foi aprovado na Câmara dos Deputados. O texto segue para o Senado e prevê diretrizes para uso ético e seguro da tecnologia.",
    imagem: "https://www12.senado.leg.br/noticias/marco-ia.jpg",
    categoria: "politica"
  },
  {
    titulo: "ONU alerta para aumento de ondas de calor extremo no mundo",
    texto: "Relatório da ONU aponta que 2025 pode ser o ano mais quente já registrado, com ondas de calor atingindo Europa, América do Norte e Ásia. Especialistas recomendam medidas urgentes de adaptação.",
    imagem: "https://www.onu.org.br/ondas_calor.jpg",
    categoria: "mundo"
  },
  {
    titulo: "Novo filme brasileiro vence prêmio em festival internacional",
    texto: "O longa 'Caminhos do Sertão', dirigido por Ana Souza, conquistou o prêmio de melhor filme no Festival de Cinema de Berlim. O drama retrata a vida de uma família no interior do Nordeste.",
    imagem: "https://cinemabrasil.org.br/caminhos_berlim.jpg",
    categoria: "entretenimento"
  },
  {
    titulo: "Seleção feminina de futebol garante vaga na Copa do Mundo 2027",
    texto: "Com vitória sobre a Argentina por 2 a 0, a seleção brasileira feminina de futebol se classificou para a Copa do Mundo de 2027. Os gols foram marcados por Marta e Debinha.",
    imagem: "https://cbf.com.br/futebol_feminino_2027.jpg",
    categoria: "esportes"
  },
  {
    titulo: "Banco Central mantém taxa Selic em 10,5% ao ano",
    texto: "O Comitê de Política Monetária (Copom) decidiu manter a taxa básica de juros em 10,5% ao ano, citando incertezas no cenário internacional e pressões inflacionárias.",
    imagem: "https://valor.globo.com/bc_selic.jpg",
    categoria: "economia"
  }
]; 
let usuarioAtual = null;
let categoriaFiltro = 'todas'; 


const artigosCategoria = {
  politica: "sobre a política",
  esportes: "sobre os esportes",
  economia: "sobre a economia",
  mundo: "sobre o mundo",
  entretenimento: "sobre o entretenimento",
  todas: ""
};


function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  const found = usuarios.find(u => u.username === user && u.password === pass);

  if (found) {
    usuarioAtual = found;
    document.getElementById("login-area").style.display = "none";
    document.getElementById("main-area").style.display = "block";

    // Editor tem todas as permissões
    if (usuarioAtual.role === "editor") {
      document.getElementById("editor-area").style.display = "block";
    } else {
      document.getElementById("editor-area").style.display = "none";
    }

    atualizarFeed();
  } else {
    alert("Usuário ou senha incorretos!");
  }
}


function logout() {
  usuarioAtual = null;
  document.getElementById("login-area").style.display = "block";
  document.getElementById("main-area").style.display = "none";
}


function publicar() {
  const tituloInput = document.getElementById("noticia-titulo");
  const textoInput = document.getElementById("noticia-texto");
  const categoriaSelect = document.getElementById("categoria");
  const imagemInput = document.getElementById("noticia-imagem");
  const titulo = tituloInput.value.trim();
  const texto = textoInput.value.trim();
  const categoria = categoriaSelect.value;
  let imagem = null;

  if (imagemInput.files.length > 0) {
    imagem = URL.createObjectURL(imagemInput.files[0]);
  }

  if (!titulo && !texto && !imagem) {
    alert("Digite algo ou adicione uma imagem!");
    tituloInput.focus();
    return;
  }

  noticias.unshift({ titulo, texto, imagem, categoria });
  tituloInput.value = "";
  textoInput.value = "";
  imagemInput.value = "";
  categoriaSelect.selectedIndex = 0;
  tituloInput.focus();
  atualizarFeed();
}


function excluirNoticia(index) {
  noticias.splice(index, 1);
  atualizarFeed();
}


function filtrarCategoria(categoria) {
  categoriaFiltro = categoria;
  atualizarFeed();
}


function atualizarFeed() {
  const feed = document.getElementById("feed");
  feed.innerHTML = "";

  
  const tituloFeed = document.getElementById("titulo-feed");
  if (categoriaFiltro === "todas") {
    tituloFeed.textContent = "Feed de Notícias";
  } else {
    tituloFeed.textContent = "Feed de Notícias " + artigosCategoria[categoriaFiltro];
  }

  let noticiasFiltradas = noticias;
  if (categoriaFiltro !== 'todas') {
    noticiasFiltradas = noticias.filter(n => n.categoria === categoriaFiltro);
  }

  if (noticiasFiltradas.length === 0) {
    feed.innerHTML = "<p>Sem notícias no momento.</p>";
    return;
  }

  noticiasFiltradas.forEach((n, i) => {
    const div = document.createElement("div");
    div.className = `card ${n.categoria}`;

    if (n.titulo) {
      const t = document.createElement("h3");
      t.textContent = n.titulo;
      div.appendChild(t);
    }

    if (n.texto) {
      const p = document.createElement("p");
      p.textContent = n.texto;
      div.appendChild(p);
    }

    if (n.imagem) {
      const img = document.createElement("img");
      img.src = n.imagem;
      div.appendChild(img);
    }

    if (usuarioAtual && usuarioAtual.role === "editor") {
      const btn = document.createElement("button");
      btn.textContent = "Excluir";
      btn.onclick = () => excluirNoticia(i);
      div.appendChild(btn);
    }

    feed.appendChild(div);
  });
}
