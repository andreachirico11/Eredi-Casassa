if (!sessionStorage.getItem('isAuthenticated')) {
  window.stop();
  window.location.href = window.location.origin + '/index.html';
}
