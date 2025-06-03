// Questo file gestisce il routing delle pagine

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  
  // Gestione delle rotte
  switch(path) {
    case '/privacy':
      window.location.href = '/pages/privacy.html';
      break;
    case '/cookie-policy':
      window.location.href = '/pages/cookie-policy.html';
      break;
    case '/404':
      window.location.href = '/pages/404.html';
      break;
  }
});