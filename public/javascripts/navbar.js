document.getElementById('navbar-toggler').addEventListener('click', () => {
  document.getElementsByTagName('header')[0].classList.toggle('navbar-open');
});

if (sessionStorage.getItem('isAuthenticated')) {
  document.getElementById('adminBtn').style.display = 'unset';
}
