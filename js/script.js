// script.js - manter simples e separado

// [EXISTENTE] Remove o loader após a página carregar (AGORA COM FADE-OUT)
window.addEventListener('load', () => {
  // tempo mínimo para mostrar o loader
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
        // CORREÇÃO: ADICIONA A CLASSE para iniciar a transição de fade-out
        loader.classList.add('loader-hide');
    }
  }, 1200);
});

// [EXISTENTE] Atualiza o ano do footer automaticamente
document.addEventListener('DOMContentLoaded', () => {
  const y = new Date().getFullYear();
  const el = document.getElementById('year');
  if (el) el.textContent = y;
  
  // ============================================
  // NOVO: LÓGICA DO PAINEL INTERATIVO DE MEMBROS
  // ============================================
  const instrumentIcons = document.querySelectorAll('.instrument-icon');
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