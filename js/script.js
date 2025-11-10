// script.js - manter simples e separado

// script.js — lógica do loader controlada pelo clique na logo
// Loader controlado por clique e áudio persistente

document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  const loaderLogoBtn = document.getElementById('loader-logo-btn');
  const sound = document.getElementById('loader-sound');

  if (!loader || !loaderLogoBtn) return;

  // Garante que o som continue tocando após o fade-out
  const enterSite = async () => {
    try {
      if (sound) {
        sound.currentTime = 0;
        await sound.play(); // começa a tocar no clique
      }
    } catch (err) {
      console.warn('Falha ao tocar áudio:', err);
    }

    // Faz o fade-out do loader, mas NÃO pausa o som
    loader.classList.add('loader-hide');

    // Só remove o elemento visualmente — não remove o <audio>
    setTimeout(() => {
      loader.style.display = 'none';
    }, 900); // após o fade-out
  };

  // Eventos de interação
  loaderLogoBtn.addEventListener('click', enterSite);
  loaderLogoBtn.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' || e.key === ' ') enterSite();
  });
});


// [EXISTENTE] Atualiza o ano do footer automaticamente
document.addEventListener('DOMContentLoaded', () => {
  const y = new Date().getFullYear();
  const el = document.getElementById('year');
  if (el) el.textContent = y;
  
  // ===========================================
  // NOVO: TOCA O SOM DO ACORDE NO INÍCIO
  // ===========================================
  const sound = document.getElementById('loader-sound');
  if (sound) {
    // Tenta tocar o áudio. Isso pode falhar devido a restrições do navegador (veja nota abaixo).
    sound.play().catch(error => {
      console.log("Falha ao tocar o áudio automaticamente:", error);
      // Se falhar, o áudio será ignorado, mas o resto da página carregará.
    });
  }
  
  // ============================================
  // NOVO: LÓGICA DO PAINEL INTERATIVO DE MEMBROS
  // ============================================
  const instrumentIcons = document.querySelectorAll('.instrument-btn');
  const memberCards = document.querySelectorAll('.member-card');

  // Adiciona o listener para cada ícone
  instrumentIcons.forEach(icon => {
    icon.addEventListener('click', () => {
      const memberId = icon.getAttribute('data-member');
      
      // 1. Esconde todos os cards e remove o estado 'active' dos ícones
      instrumentIcons.forEach(i => i.classList.remove('active'));
      memberCards.forEach(card => card.classList.remove('active'));
      
      // 2. Ativa o ícone clicado
      icon.classList.add('active');
      
      // 3. Exibe o card correspondente com a animação CSS
      const targetCard = document.getElementById(`${memberId}-card`);
      if (targetCard) {
        targetCard.classList.add('active');
      }
    });
  });
});

// === GALERIA LIGHTBOX ===
document.addEventListener('DOMContentLoaded', () => {
  const galleryImages = document.querySelectorAll('.gallery-img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const btnClose = document.querySelector('.lightbox-close');
  const btnPrev = document.querySelector('.lightbox-prev');
  const btnNext = document.querySelector('.lightbox-next');

  let currentIndex = 0;

  // abrir imagem
  const openLightbox = (index) => {
    currentIndex = index;
    lightboxImg.src = galleryImages[index].src;
    lightbox.classList.add('active');
  };

  // fechar
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    setTimeout(() => {
      lightboxImg.src = '';
    }, 200);
  };

  // anterior / próximo
  const showPrev = () => {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentIndex].src;
  };
  const showNext = () => {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    lightboxImg.src = galleryImages[currentIndex].src;
  };

  // eventos
  galleryImages.forEach((img, index) => {
    img.addEventListener('click', () => openLightbox(index));
  });
  btnClose.addEventListener('click', closeLightbox);
  btnPrev.addEventListener('click', showPrev);
  btnNext.addEventListener('click', showNext);

  // fechar com ESC e navegar pelas setas
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  // fechar clicando fora da imagem
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
});

// Animação suave de fade-up ao rolar (timeline)
document.addEventListener("scroll", () => {
  const cards = document.querySelectorAll(".timeline-card");
  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      card.classList.add("visible");
    }
  });
});

// ===== DRAG + AUTO-SCROLL para timeline =====
const timeline = document.querySelector(".timeline-container");
if (timeline) {
  let isDown = false;
  let startX;
  let scrollLeft;
  let autoScroll;
  let direction = 1; // 1 = direita, -1 = esquerda

  // Função de auto-scroll suave
  function startAutoScroll() {
    stopAutoScroll(); // evita duplicar
    autoScroll = setInterval(() => {
      timeline.scrollLeft += 0.6 * direction;
      // inverte direção ao atingir as bordas
      if (timeline.scrollLeft + timeline.clientWidth >= timeline.scrollWidth - 5) {
        direction = -1;
      } else if (timeline.scrollLeft <= 0) {
        direction = 1;
      }
    }, 16); // ~60fps
  }

  function stopAutoScroll() {
    clearInterval(autoScroll);
  }

  // Inicia o auto-scroll quando carregar
  startAutoScroll();

  // Pausa quando o mouse entra
  timeline.addEventListener("mouseenter", stopAutoScroll);
  // Retoma quando o mouse sai
  timeline.addEventListener("mouseleave", startAutoScroll);

  // Drag manual com o mouse
  timeline.addEventListener("mousedown", (e) => {
    isDown = true;
    timeline.classList.add("dragging");
    startX = e.pageX - timeline.offsetLeft;
    scrollLeft = timeline.scrollLeft;
    stopAutoScroll(); // pausa enquanto arrasta
  });
  timeline.addEventListener("mouseleave", () => {
    isDown = false;
    timeline.classList.remove("dragging");
  });
  timeline.addEventListener("mouseup", () => {
    isDown = false;
    timeline.classList.remove("dragging");
    startAutoScroll(); // retoma
  });
  timeline.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - timeline.offsetLeft;
    const walk = (x - startX) * 1.2; // sensibilidade
    timeline.scrollLeft = scrollLeft - walk;
  });

  // Suporte a toque (mobile)
  let startTouchX = 0;
  let touchScrollLeft = 0;

  timeline.addEventListener("touchstart", (e) => {
    stopAutoScroll();
    startTouchX = e.touches[0].pageX;
    touchScrollLeft = timeline.scrollLeft;
  });

  timeline.addEventListener("touchmove", (e) => {
    const x = e.touches[0].pageX;
    const walk = (x - startTouchX) * 1.2;
    timeline.scrollLeft = touchScrollLeft - walk;
  });

  timeline.addEventListener("touchend", startAutoScroll);
}
// adiciona ao final do script.js
document.addEventListener("scroll", () => {
  const cards = document.querySelectorAll(".artist-card");
  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) card.classList.add("visible");
  });
});

// === Clique para mostrar frase e nome (mobile e desktop) ===
document.addEventListener('DOMContentLoaded', () => {
  const artistCards = document.querySelectorAll('.artist-card');

  artistCards.forEach(card => {
    const quote = card.getAttribute('data-quote');
    const overlay = card.querySelector('.overlay');
    if (quote && overlay) {
      const p = document.createElement('p');
      p.className = 'quote';
      p.textContent = quote;
      overlay.appendChild(p);
    }

    // Clique e toque para ativar no desktop e mobile
    ['click', 'touchstart'].forEach(evt => {
      card.addEventListener(evt, (e) => {
        e.preventDefault(); // evita clique duplo no mobile
        artistCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      }, { passive: true });
    });
  });

  // toque fora para fechar
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.artist-card')) {
      artistCards.forEach(c => c.classList.remove('active'));
    }
  });
});

// ============================
// MODAIS DOS MÚSICOS
// ============================
document.querySelectorAll('.artist-card').forEach(card => {
  card.addEventListener('click', () => {
    const name = card.querySelector('h4').textContent.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const modal = document.getElementById(`modal-${name}`);
    if (modal) modal.classList.add('active');
  });
});

// fechar modais
document.querySelectorAll('.close-modal').forEach(btn => {
  btn.addEventListener('click', e => {
    e.target.closest('.artist-modal').classList.remove('active');
  });
});

// fechar ao clicar fora
document.querySelectorAll('.artist-modal').forEach(modal => {
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.classList.remove('active');
  });
});

// ============================
// CARROSSEL DE MEMBROS MANUAL
// ============================
// ===== Carrossel manual da seção #band =====
document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('#band .carousel-track');
  if (!track) return;

  const slides = Array.from(track.children);
  const nextButton = document.querySelector('#band .carousel-btn.next');
  const prevButton = document.querySelector('#band .carousel-btn.prev');
  let currentIndex = 0;

  function updateSlidePosition() {
    const container = document.querySelector('#band .band-carousel');
    const width = container.offsetWidth; // garante largura exata visível
    slides.forEach(slide => (slide.style.minWidth = `${width}px`)); // força tamanho igual
    track.style.transform = `translateX(-${width * currentIndex}px)`;
  }

  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlidePosition();
  });

  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlidePosition();
  });

  window.addEventListener('resize', updateSlidePosition);
  updateSlidePosition();
});