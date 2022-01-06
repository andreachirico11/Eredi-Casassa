const categoryTemplate = document.getElementById('category-template');
const noProductFoundTemplate = document.getElementById('no-product-found');
const categoryTitle = document.getElementById('category-title');
const categoryParam = window.location.href.split('?')[1];
const container = document.getElementById('products-container');
const url = '../products/products.json';
const database = firebase.database();
const urlToLoadAttribute = 'urlToLoad';

database
  .ref(categoryParam)
  .orderByChild('order')
  .on(
    'value',
    (fetchedProducts) => {
      if (!fetchedProducts) {
        return redirectToProducts();
      }
      addCategoryProductsToView(extractOrderedData(fetchedProducts));
      buildCategoryTitle();
      checkForButtons(); // from scrollButton.js
      translateAll(); // from i18n.js
      lazyLoadImages().finally(onFinally);
    },
    (err) => {
      redirectToProducts();
    }
  );

function onFinally() {
  const stopTitleUnderlineAnimation = function () {
    removeEventListener(this, stopTitleUnderlineAnimation);
    this.classList.remove('loading-animation');
  };
  document.getElementById('category-title').onanimationiteration = stopTitleUnderlineAnimation;
}

function addCategoryProductsToView(products) {
  if (!products || products.length === 0) {
    return noProductFound();
  }
  container.innerHTML = null;
  for (const key in products) {
    container.appendChild(generateProdHtml(products[key]));
  }
}

function extractOrderedData(snapshot) {
  const output = [];
  snapshot.forEach((el) => {
    output.push(el.val());
  });
  return output;
}

function generateProdHtml(product) {
  const prodTemplate = categoryTemplate.content.cloneNode(true);
  prodTemplate.querySelectorAll('img')[0].alt = product.title;
  prodTemplate.querySelectorAll('span')[0].textContent = product.title;
  prodTemplate.querySelectorAll('img')[0].setAttribute(urlToLoadAttribute, product.imgUrl);
  prodTemplate.querySelectorAll('.category')[0].addEventListener('click', () => {
    onProductClick(product);
  });
  return prodTemplate;
}

function buildCategoryTitle() {
  categoryTitle.innerHTML = `
    <span id="i18n-cat${extractCategoryTitle()}"></span>

  `;
}

async function lazyLoadImages() {
  const allImgToLoad = document.querySelectorAll(`[${urlToLoadAttribute}]`),
    loadEv = 'load',
    transEv = 'transitionend';
  for (let i = 0; i < allImgToLoad.length; i++) {
    if (i === 0) {
      await promisifyEvent(allImgToLoad[i], loadEv, addSrc);
      if (allImgToLoad.length === 1) {
        await promisifyEvent(getImgParentCat(allImgToLoad[i]), transEv, removeClassesFromEl);
      }
    } else if (i === allImgToLoad.length - 1) {
      await promisifyEvent(allImgToLoad[i], loadEv, addSrc);
      await promisifyEvent(getImgParentCat(allImgToLoad[i - 1]), transEv, removeClassesFromEl);
      await promisifyEvent(getImgParentCat(allImgToLoad[i]), transEv, removeClassesFromEl);
    } else {
      await promisifyEvent(allImgToLoad[i], loadEv, addSrc);
      await promisifyEvent(getImgParentCat(allImgToLoad[i - 1]), transEv, removeClassesFromEl);
    }
  }
  return true;
}

function onProductClick(product) {
  const prodTemplate = categoryTemplate.content.cloneNode(true);
  prodTemplate.querySelectorAll('img')[0].alt = product.title;
  prodTemplate.querySelectorAll('span')[0].textContent = product.title;
  prodTemplate.querySelectorAll('img')[0].setAttribute('src', product.imgUrl);
  prodTemplate.querySelectorAll('.category')[0].classList.add('modal');
  prodTemplate.querySelectorAll('.category')[0].classList.remove('toLoad');
  prodTemplate.querySelectorAll('.category')[0].addEventListener('click', function () {
    document.body.removeChild(this);
  });
  document.body.appendChild(prodTemplate);
}

function promisifyEvent(element, eventName, callback) {
  return new Promise((res) => {
    const handler = () => {
      element.removeEventListener(eventName, handler);
      res();
    };
    const errHandler = () => {
      element.removeEventListener('error', handler);
      res();
    };
    element.addEventListener(eventName, handler);
    element.addEventListener('error', errHandler);
    callback(element);
  });
}

function addSrc(imgEl) {
  imgEl.src = imgEl.getAttribute(urlToLoadAttribute);
}

function removeClassesFromEl(element) {
  element.classList.remove('toLoad');
  element.classList.add('loaded');
}

function getImgParentCat(imgEl) {
  return imgEl.parentElement.parentElement;
}

function noProductFound() {
  container.appendChild(noProductFoundTemplate.content.cloneNode(true));
}

function redirectToProducts() {
  window.location.href = window.location.origin + '/products.html';
}

function extractCategoryTitle() {
  switch (categoryParam) {
    case 'marina':
      return 1;
    case 'accessories':
      return 2;
    case 'furniture':
      return 3;
    case 'lighting':
      return 4;
    case 'supplies':
      return 5;
    case 'spares':
      return 6;
    case 'appliances':
      return 7;
    case 'restorations':
      return 8;
    case 'creations':
      return 9;
    default:
      return 0;
  }
}
