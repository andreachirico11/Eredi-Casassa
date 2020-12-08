const navbarOpen = 'navbar-open',
  displayNone = 'display-none',
  navbar = document.getElementsByClassName('navbar')[0];

const openBtn = document.getElementsByClassName('navbar-button-open')[0];
const closeBtn = document.getElementsByClassName('navbar-button-close')[0];
const addClickList = (callb, el) => {
  el.addEventListener('click', callb);
};
const toggleOpenClose = () => {
  navbar.classList.toggle(navbarOpen);
  openBtn.classList.toggle(displayNone);
};
addClickList(toggleOpenClose, openBtn);
addClickList(toggleOpenClose, closeBtn);
