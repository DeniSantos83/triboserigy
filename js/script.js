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

