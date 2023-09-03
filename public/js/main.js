const backdrop = document.querySelector('.backdrop');
const sideDrawer = document.querySelector('.mobile-nav');
const menuToggle = document.querySelector('#side-menu-toggle');

function backdropClickHandler() {
  backdrop.style.display = 'none';
  sideDrawer.classList.remove('open');
  menuToggle.classList.toggle('change');
}

function menuToggleClickHandler() {
  backdrop.classList.toggle('active');
  sideDrawer.classList.toggle('open');
  menuToggle.classList.toggle('change');
}

backdrop.addEventListener('click', backdropClickHandler);
menuToggle.addEventListener('click', menuToggleClickHandler);
