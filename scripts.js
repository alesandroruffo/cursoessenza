const whatsappBase = 'https://wa.me/83998850124';
const message =
  'Oi! Quero entrar na próxima turma do Curso Inova Essenza (ChatGPT). Pode me passar valores e como funciona?';

const whatsappUrl = `${whatsappBase}?text=${encodeURIComponent(message)}`;

function trackWhatsAppClick(location) {
  const payload = {
    event: 'whatsapp_click',
    cta_location: location,
    page_path: window.location.pathname
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
  console.info('Tracking', payload);
}

function bindWhatsAppCtas() {
  const ctas = document.querySelectorAll('[data-cta-location]');
  ctas.forEach((cta) => {
    cta.href = whatsappUrl;
    cta.target = '_blank';
    cta.rel = 'noopener noreferrer';
    cta.addEventListener('click', () => {
      trackWhatsAppClick(cta.dataset.ctaLocation || 'unknown');
    });
  });
}

function renderNextClass(nextClass) {
  const node = document.getElementById('proximas-turmas');
  node.innerHTML = `<strong>${nextClass.label}</strong><br>${nextClass.dates}<br>${nextClass.time}`;
}

function renderModules(modules) {
  const grid = document.getElementById('modulos-grid');
  grid.innerHTML = modules
    .map(
      (item, index) => `
      <article class="card module-card">
        <h3>Módulo ${index + 1} — ${item.title}</h3>
        <p>${item.description}</p>
      </article>`
    )
    .join('');
}

function renderTurmas(turmas) {
  const grid = document.getElementById('turmas-grid');
  grid.innerHTML = turmas
    .map(
      (turma) => `
      <a class="card turma" href="${turma.reelsUrl}" target="_blank" rel="noopener noreferrer">
        <img loading="lazy" src="${turma.foto}" alt="${turma.nome}" />
        <h3>${turma.nome}</h3>
        <p class="turma__cta">Assistir Reels</p>
      </a>`
    )
    .join('');
}

function renderVideos(videos) {
  const abertos = document.getElementById('videos-abertos');
  const restritos = document.getElementById('videos-restritos');

  abertos.innerHTML = videos.abertos
    .map(
      (video) => `
      <article class="card video">
        <a href="${video.url}" target="_blank" rel="noopener noreferrer">
          <img loading="lazy" src="${video.thumb || 'fundo-essenza.jpeg'}" alt="${video.titulo}" />
        </a>
        <h3>${video.titulo}</h3>
      </article>`
    )
    .join('');

  restritos.innerHTML = videos.restritos
    .map(
      (video) => `
      <article class="card video video--locked">
        <img loading="lazy" src="${video.thumb || 'fundo-essenza.jpeg'}" alt="${video.titulo}" />
        <h3>${video.titulo}</h3>
        <span class="locked-tag">🔒 Conteúdo completo disponível para alunas.</span>
      </article>`
    )
    .join('');
}

async function loadContent() {
  try {
    const [configRes, turmasRes, videosRes] = await Promise.all([
      fetch('content/config.json'),
      fetch('content/turmas.json'),
      fetch('content/videos.json')
    ]);

    const config = await configRes.json();
    const turmas = await turmasRes.json();
    const videos = await videosRes.json();

    renderNextClass(config.nextClass);
    renderModules(config.modules);
    renderTurmas(turmas);
    renderVideos(videos);
  } catch (error) {
    console.error('Falha ao carregar conteúdo dinâmico.', error);
  }
}

bindWhatsAppCtas();
loadContent();
