const [scrollLeft, scrollRight] = Array.from(document.getElementsByClassName('scroll-btn')).map(
  (div) => div.children[0]
);
const grid = document.getElementsByClassName('articles-grid')[0];
const speed = 70,
  distance = 150,
  step = 30;

const isScrolling = () => grid.scrollWidth > grid.clientWidth;

scrollLeft.addEventListener('click', function () {
  sideScroll(grid, 'left', speed, distance, step);
});

scrollRight.addEventListener('click', function () {
  sideScroll(grid, 'right', speed, distance, step);
});

window.onresize = function () {
  checkForButtons();
};

function checkForButtons() {
  if (isScrolling()) {
    setButtonsOpacity(1);
  } else {
    setButtonsOpacity(0);
  }
}

checkForButtons();

function setButtonsOpacity(o) {
  scrollLeft.style.opacity = o;
  scrollRight.style.opacity = o;
}

function sideScroll(element, direction, speed, distance, step) {
  scrollAmount = 0;
  const slideTimer = setInterval(function () {
    if (direction == 'left') {
      element.scrollLeft -= step;
    } else {
      element.scrollLeft += step;
    }
    scrollAmount += step;
    if (scrollAmount >= distance) {
      clearInterval(slideTimer);
    }
  }, speed);
}
