// Configuração e dados
const usuarios = [
  { username: "editor", password: "123", role: "editor", avatar: "https://i.pravatar.cc/40?img=3" },
  { username: "leitor", password: "123", role: "leitor", avatar: "https://i.pravatar.cc/40?img=4" }
];

let noticias = [
  {
    id: 1,
    titulo: "Brasil conquista medalha de ouro no vôlei nas Olimpíadas",
    texto: "A seleção brasileira masculina de vôlei venceu a final contra a Polônia por 3 sets a 1 e garantiu o ouro nas Olimpíadas de Paris 2024. O destaque da partida foi o oposto Alan, que marcou 28 pontos e foi eleito o melhor jogador da competição.",
    imagem: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=400&fit=crop",
    categoria: "esportes",
    autor: "Carlos Silva",
    data: new Date(),
    views: 1245,
    likes: 89
  },
  {
    id: 2,
    titulo: "Inflação no Brasil desacelera em agosto e fecha em 0,12%",
    texto: "O IPCA de agosto registrou alta de 0,12%, segundo o IBGE. O resultado foi puxado pela queda nos preços dos combustíveis e alimentos. No acumulado de 12 meses, a inflação está em 4,6%, dentro da meta estabelecida pelo governo.",
    imagem: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop",
    categoria: "economia",
    autor: "Ana Santos",
    data: new Date(Date.now() - 86400000),
    views: 876,
    likes: 45
  },
  {
    id: 3,
    titulo: "Câmara aprova novo marco legal da inteligência artificial",
    texto: "O projeto de lei que regulamenta o uso de inteligência artificial no Brasil foi aprovado na Câmara dos Deputados por 342 votos a favor e 89 contra. O texto segue para o Senado e prevê diretrizes para uso ético e seguro da tecnologia em diversos setores.",
    imagem: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    categoria: "politica",
    autor: "João Oliveira",
    data: new Date(Date.now() - 172800000),
    views: 567,
    likes: 23
  },
  {
    id: 4,
    titulo: "ONU alerta para aumento de ondas de calor extremo no mundo",
    texto: "Relatório da ONU aponta que 2025 pode ser o ano mais quente já registrado, com ondas de calor atingindo Europa, América do Norte e Ásia. Especialistas recomendam medidas urgentes de adaptação e mitigação das mudanças climáticas.",
    imagem: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=400&fit=crop",
    categoria: "mundo",
    autor: "Maria Costa",
    data: new Date(Date.now() - 259200000),
    views: 789,
    likes: 67
  },
  {
    id: 5,
    titulo: "Novo filme brasileiro vence prêmio em festival internacional",
    texto: "O longa 'Caminhos do Sertão', dirigido por Ana Souza, conquistou o prêmio de melhor filme no Festival de Cinema de Berlim. O drama retrata a vida de uma família no interior do Nordeste e já tem distribuição confirmada em 15 países.",
    imagem: "https://images.unsplash.com/photo-1489599904472-8421b4c35c71?w=800&h=400&fit=crop",
    categoria: "entretenimento",
    autor: "Pedro Lima",
    data: new Date(Date.now() - 345600000),
    views: 432,
    likes: 78
  }
];

let usuarioAtual = null;
let categoriaAtual = 'todas';
let ordemAtual = 'recente';
let isListView = false;
let searchTerm = '';

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar AOS se disponível
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100
    });
  }
  
  // Event listeners
  setupEventListeners();
  
  // Verificar se já está logado (localStorage)
  checkStoredLogin();
});

function setupEventListeners() {
  // Enter no login
  document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && document.getElementById('login-area').style.display !== 'none') {
      login();
    }
  });
  
  // Clique fora do menu de perfil
  document.addEventListener('click', function(e) {
    const profileMenu = document.getElementById('profile-menu');
    const profileInfo = document.querySelector('.profile-info');
    
    if (profileMenu && !profileInfo.contains(e.target)) {
      profileMenu.classList.remove('show');
    }
  });
}

function checkStoredLogin() {
  const storedUser = localStorage.getItem('blogUser');
  if (storedUser) {
    usuarioAtual = JSON.parse(storedUser);
    showMainArea();
  }
}

// Autenticação
function login() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();
  
  if (!user || !pass) {
    showNotification("Preencha todos os campos!", "error");
    return;
  }
  
  const found = usuarios.find(u => u.username === user && u.password === pass);

  if (found) {
    usuarioAtual = found;
    localStorage.setItem('blogUser', JSON.stringify(usuarioAtual));
    
    // Animação de transição
    gsap.to("#login-area", {
      opacity: 0,
      scale: 0.9,
      duration: 0.5,
      onComplete: showMainArea
    });
    
    showNotification(`Bem-vindo, ${usuarioAtual.username}!`, "success");
  } else {
    showNotification("Usuário ou senha incorretos!", "error");
    
    // Shake animation
    gsap.fromTo("#login-area", 
      { x: 0 }, 
      { x: 10, duration: 0.1, repeat: 5, yoyo: true }
    );
  }
}

function showMainArea() {
  document.getElementById("login-area").style.display = "none";
  document.getElementById("main-area").style.display = "block";
  
  // Configurar interface baseada no usuário
  setupUserInterface();
  
  // Carregar feed
  atualizarFeed();
  
  // Animações de entrada
  gsap.fromTo(".navbar", 
    { y: -50, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.6 }
  );
  
  gsap.fromTo(".sidebar", 
    { x: -100, opacity: 0 }, 
    { x: 0, opacity: 1, duration: 0.6, delay: 0.2 }
  );
  
  gsap.fromTo(".main-content", 
    { y: 30, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.6, delay: 0.4 }
  );
}

function setupUserInterface() {
  // Atualizar nome do usuário
  document.getElementById('user-name').textContent = usuarioAtual.username;
  
  // Atualizar avatar
  const avatar = document.querySelector('.profile-avatar');
  if (avatar) {
    avatar.src = usuarioAtual.avatar;
  }
  
  // Mostrar/esconder elementos baseado no role
  const newPostBtn = document.getElementById('new-post-btn');
  const fab = document.getElementById('fab');
  
  if (usuarioAtual.role === "editor") {
    if (newPostBtn) newPostBtn.style.display = 'flex';
    if (fab) fab.style.display = 'flex';
  } else {
    if (newPostBtn) newPostBtn.style.display = 'none';
    if (fab) fab.style.display = 'none';
  }
  
  // Estatísticas do perfil
  updateProfileStats();
}

function updateProfileStats() {
  const userPosts = noticias.filter(n => n.autor === usuarioAtual.username);
  document.getElementById('posts-count').textContent = userPosts.length;
  
  // Simular seguidores
  document.getElementById('followers-count').textContent = Math.floor(Math.random() * 100);
  document.getElementById('following-count').textContent = Math.floor(Math.random() * 50);
}

function logout() {
  localStorage.removeItem('blogUser');
  usuarioAtual = null;
  
  // Animação de saída
  gsap.to("#main-area", {
    opacity: 0,
    scale: 0.9,
    duration: 0.5,
    onComplete: function() {
      document.getElementById("main-area").style.display = "none";
      document.getElementById("login-area").style.display = "flex";
      
      // Limpar campos
      document.getElementById("username").value = "";
      document.getElementById("password").value = "";
      
      // Resetar login area
      gsap.set("#login-area", { opacity: 1, scale: 1 });
    }
  });
  
  showNotification("Logout realizado com sucesso!", "info");
}

// Interface do usuário
function toggleProfileMenu() {
  const menu = document.getElementById('profile-menu');
  menu.classList.toggle('show');
}

function showProfile() {
  document.getElementById('profile-modal').classList.add('show');
  updateProfileStats();
}

function showSettings() {
  showNotification("Configurações em desenvolvimento", "info");
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('show');
}

// Editor
function toggleEditor() {
  const editorArea = document.getElementById('editor-area');
  const isVisible = editorArea.style.display !== 'none';
  
  if (isVisible) {
    gsap.to(editorArea, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      onComplete: function() {
        editorArea.style.display = 'none';
      }
    });
  } else {
    editorArea.style.display = 'block';
    gsap.fromTo(editorArea, 
      { opacity: 0, y: -20 }, 
      { opacity: 1, y: 0, duration: 0.3 }
    );
    
    // Focar no primeiro campo
    document.getElementById('noticia-titulo').focus();
  }
}

function switchTab(tabName) {
  // Remover classe ativa de todas as abas
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.style.display = 'none');
  
  // Ativar aba selecionada
  event.target.classList.add('active');
  document.getElementById(tabName + '-tab').style.display = 'block';
  
  if (tabName === 'preview') {
    updatePreview();
  }
}

function updatePreview() {
  const titulo = document.getElementById('noticia-titulo').value;
  const autor = document.getElementById('noticia-autor').value || usuarioAtual.username;
  const texto = document.getElementById('noticia-texto').value;
  const categoria = document.getElementById('categoria').value;
  
  const preview = document.getElementById('preview-content');
  
  preview.innerHTML = `
    <div class="card">
      <div class="card-content">
        <div class="card-meta">
          <div class="card-author">
            <img src="${usuarioAtual.avatar}" alt="Author">
            <span>${autor}</span>
          </div>
          <span>•</span>
          <span>Agora</span>
          ${categoria ? `<span class="card-category ${categoria}">${categoria.toUpperCase()}</span>` : ''}
        </div>
        <h3>${titulo || 'Título da notícia'}</h3>
        <div class="card-text">${texto || 'Conteúdo da notícia aparecerá aqui...'}</div>
      </div>
    </div>
  `;
}

function salvarRascunho() {
  const titulo = document.getElementById('noticia-titulo').value.trim();
  const texto = document.getElementById('noticia-texto').value.trim();
  
  if (!titulo && !texto) {
    showNotification("Nada para salvar!", "warning");
    return;
  }
  
  // Salvar no localStorage
  const rascunho = {
    titulo,
    texto,
    autor: document.getElementById('noticia-autor').value || usuarioAtual.username,
    categoria: document.getElementById('categoria').value,
    data: new Date()
  };
  
  localStorage.setItem('rascunho_blog', JSON.stringify(rascunho));
  showNotification("Rascunho salvo!", "success");
}

function publicar() {
  const tituloInput = document.getElementById("noticia-titulo");
  const textoInput = document.getElementById("noticia-texto");
  const autorInput = document.getElementById("noticia-autor");
  const categoriaSelect = document.getElementById("categoria");
  const imagemInput = document.getElementById("noticia-imagem");
  
  const titulo = tituloInput.value.trim();
  const texto = textoInput.value.trim();
  const autor = autorInput.value.trim() || usuarioAtual.username;
  const categoria = categoriaSelect.value;
  let imagem = null;

  if (imagemInput.files.length > 0) {
    imagem = URL.createObjectURL(imagemInput.files[0]);
  } else {
    // Imagem padrão baseada na categoria
    const imagensPadrao = {
      'politica': 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=400&fit=crop',
      'esportes': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=400&fit=crop',
      'economia': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop',
      'mundo': 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=400&fit=crop',
      'entretenimento': 'https://images.unsplash.com/photo-1489599904472-8421b4c35c71?w=800&h=400&fit=crop'
    };
    imagem = imagensPadrao[categoria] || 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=400&fit=crop';
  }

  if (!titulo && !texto) {
    showNotification("Digite um título ou conteúdo para a notícia!", "error");
    tituloInput.focus();
    return;
  }

  const novaNoticia = {
    id: Date.now(),
    titulo: titulo || "Sem título",
    texto: texto || "Sem conteúdo",
    autor,
    imagem,
    categoria: categoria || "geral",
    data: new Date(),
    views: 0,
    likes: 0
  };

  noticias.unshift(novaNoticia);
  
  // Limpar formulário
  tituloInput.value = "";
  textoInput.value = "";
  autorInput.value = "";
  imagemInput.value = "";
  categoriaSelect.selectedIndex = 0;
  
  // Fechar editor
  toggleEditor();
  
  // Atualizar feed
  atualizarFeed();
  
  // Limpar rascunho
  localStorage.removeItem('rascunho_blog');
  
  showNotification("Notícia publicada com sucesso!", "success");
  
  // Animar nova notícia
  setTimeout(() => {
    const firstCard = document.querySelector('.card');
    if (firstCard) {
      gsap.fromTo(firstCard, 
        { scale: 0.9, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }
      );
    }
  }, 100);
}

// Feed e filtros
function atualizarFeed() {
  const feed = document.getElementById("feed");
  let noticiasFiltradas = filtrarNoticias();
  
  if (noticiasFiltradas.length === 0) {
    feed.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-newspaper"></i>
        <h3>Nenhuma notícia encontrada</h3>
        <p>Não há notícias para os filtros selecionados.</p>
      </div>
    `;
    return;
  }
  
  feed.innerHTML = noticiasFiltradas.map((noticia, index) => criarCardNoticia(noticia, index)).join("");
  
  // Animar cards
  gsap.fromTo(".card", 
    { y: 30, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }
  );
  
  // Atualizar título do feed
  updateFeedTitle();
}

function filtrarNoticias() {
  let resultado = [...noticias];
  
  // Filtrar por categoria
  if (categoriaAtual !== 'todas') {
    resultado = resultado.filter(n => n.categoria === categoriaAtual);
  }
  
  // Filtrar por pesquisa
  if (searchTerm) {
    resultado = resultado.filter(n => 
      n.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.texto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.autor.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Ordenar
  switch (ordemAtual) {
    case 'recente':
      resultado.sort((a, b) => new Date(b.data) - new Date(a.data));
      break;
    case 'popular':
      resultado.sort((a, b) => (b.views + b.likes) - (a.views + a.likes));
      break;
    case 'alfabetico':
      resultado.sort((a, b) => a.titulo.localeCompare(b.titulo));
      break;
  }
  
  return resultado;
}

function criarCardNoticia(noticia, index) {
  const dataFormatada = formatarData(noticia.data);
  const podeExcluir = usuarioAtual && usuarioAtual.role === "editor";
  
  return `
    <article class="card ${noticia.categoria}" data-aos="fade-up" data-aos-delay="${index * 100}">
      <div class="card-image">
        <img src="${noticia.imagem}" alt="${noticia.titulo}" loading="lazy">
        <span class="card-category ${noticia.categoria}">${noticia.categoria}</span>
      </div>
      <div class="card-content">
        <div class="card-meta">
          <div class="card-author">
            <img src="https://i.pravatar.cc/24?u=${noticia.autor}" alt="${noticia.autor}">
            <span>${noticia.autor}</span>
          </div>
          <span>•</span>
          <span>${dataFormatada}</span>
        </div>
        <h3>${noticia.titulo}</h3>
        <div class="card-text">${truncateText(noticia.texto, 150)}</div>
        <div class="card-actions">
          <div class="card-stats">
            <div class="stat-item">
              <i class="fas fa-eye"></i>
              <span>${formatNumber(noticia.views)}</span>
            </div>
            <div class="stat-item">
              <i class="fas fa-heart"></i>
              <span>${formatNumber(noticia.likes)}</span>
            </div>
          </div>
          ${podeExcluir ? `
            <button class="card-delete" onclick="excluirNoticia(${noticia.id})" title="Excluir notícia">
              <i class="fas fa-trash"></i>
              Excluir
            </button>
          ` : ''}
        </div>
      </div>
    </article>
  `;
}

function updateFeedTitle() {
  const titleElement = document.getElementById('feed-title');
  let title = 'Últimas Notícias';
  
  if (categoriaAtual !== 'todas') {
    const categorias = {
      'politica': 'Política',
      'esportes': 'Esportes', 
      'economia': 'Economia',
      'mundo': 'Mundo',
      'entretenimento': 'Entretenimento'
    };
    title = categorias[categoriaAtual] || categoriaAtual;
  }
  
  if (searchTerm) {
    title = `Pesquisa: "${searchTerm}"`;
  }
  
  titleElement.textContent = title;
}

function filtrarCategoria(categoria) {
  categoriaAtual = categoria;
  
  // Atualizar botões ativos
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  atualizarFeed();
}

function ordenarNoticias() {
  ordemAtual = document.getElementById('sort-select').value;
  atualizarFeed();
}

function toggleView() {
  isListView = !isListView;
  const feed = document.getElementById('feed');
  const button = document.querySelector('.view-toggle i');
  
  if (isListView) {
    feed.classList.add('list-view');
    button.className = 'fas fa-th';
  } else {
    feed.classList.remove('list-view');
    button.className = 'fas fa-th-large';
  }
}

function pesquisarNoticias() {
  searchTerm = document.getElementById('search-input').value.trim();
  atualizarFeed();
}

function excluirNoticia(id) {
  if (!confirm('Tem certeza que deseja excluir esta notícia?')) {
    return;
  }
  
  const index = noticias.findIndex(n => n.id === id);
  if (index !== -1) {
    // Animar saída
    const card = document.querySelector(`[onclick*="${id}"]`).closest('.card');
    gsap.to(card, {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      onComplete: function() {
        noticias.splice(index, 1);
        atualizarFeed();
        showNotification("Notícia excluída!", "success");
      }
    });
  }
}

// Funcionalidades sociais
function toggleFollow(button) {
  const isFollowing = button.classList.contains('following');
  
  if (isFollowing) {
    button.classList.remove('following');
    button.innerHTML = '<i class="fas fa-plus"></i>';
    showNotification("Deixou de seguir", "info");
  } else {
    button.classList.add('following');
    button.innerHTML = '<i class="fas fa-check"></i>';
    showNotification("Seguindo!", "success");
  }
  
  // Atualizar estatísticas
  updateProfileStats();
}

function carregarMais() {
  showNotification("Carregando mais notícias...", "info");
  
  // Simular carregamento
  setTimeout(() => {
    showNotification("Todas as notícias foram carregadas!", "info");
  }, 1500);
}

// Utilitários
function formatarData(data) {
  const agora = new Date();
  const diff = agora - new Date(data);
  const minutos = Math.floor(diff / 60000);
  const horas = Math.floor(diff / 3600000);
  const dias = Math.floor(diff / 86400000);
  
  if (minutos < 1) return 'Agora';
  if (minutos < 60) return `${minutos}m`;
  if (horas < 24) return `${horas}h`;
  if (dias < 7) return `${dias}d`;
  
  return new Date(data).toLocaleDateString('pt-BR');
}

function truncateText(text, limit) {
  if (text.length <= limit) return text;
  return text.substr(0, limit) + '...';
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function showNotification(message, type = 'info') {
  // Criar elemento de notificação
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${getNotificationIcon(type)}"></i>
      <span>${message}</span>
    </div>
  `;
  
  // Adicionar estilos
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    background: getNotificationColor(type),
    color: 'white',
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    zIndex: '10000',
    transform: 'translateX(400px)',
    transition: 'transform 0.3s ease'
  });
  
  document.body.appendChild(notification);
  
  // Animar entrada
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Remover após 3 segundos
  setTimeout(() => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

function getNotificationIcon(type) {
  const icons = {
    'success': 'check-circle',
    'error': 'exclamation-circle',
    'warning': 'exclamation-triangle',
    'info': 'info-circle'
  };
  return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
  const colors = {
    'success': '#10b981',
    'error': '#ef4444',
    'warning': '#f59e0b',
    'info': '#06b6d4'
  };
  return colors[type] || '#06b6d4';
}

// Carregar rascunho ao inicializar
window.addEventListener('load', function() {
  const rascunho = localStorage.getItem('rascunho_blog');
  if (rascunho && usuarioAtual && usuarioAtual.role === 'editor') {
    try {
      const dados = JSON.parse(rascunho);
      if (confirm('Há um rascunho salvo. Deseja carregá-lo?')) {
        document.getElementById('noticia-titulo').value = dados.titulo || '';
        document.getElementById('noticia-texto').value = dados.texto || '';
        document.getElementById('noticia-autor').value = dados.autor || '';
        document.getElementById('categoria').value = dados.categoria || '';
      }
    } catch (e) {
      console.error('Erro ao carregar rascunho:', e);
    }
  }
});