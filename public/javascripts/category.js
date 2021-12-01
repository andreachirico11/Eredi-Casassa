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
      lazyLoadImages();
    },
    (err) => {
      redirectToProducts();
    }
  );

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
  prodTemplate.querySelectorAll('.category')[0].addEventListener('click', function () {
    this.classList.toggle('modal');
  });
  return prodTemplate;
}

function buildCategoryTitle() {
  categoryTitle.innerHTML = `
    <span id="i18n-cat${extractCategoryTitle()}"></span>

  `;
}

function lazyLoadImages() {
  const allImagesToLoad = document.querySelectorAll(`[${urlToLoadAttribute}]`);
  if (allImagesToLoad.length > 0) {
    loadImage(allImagesToLoad[0]);
  }
}

function loadImage(imgToLoad) {
  imgToLoad.addEventListener('load', onImageLoad);
  imgToLoad.src = imgToLoad.getAttribute(urlToLoadAttribute);
}

function onImageLoad() {
  this.removeAttribute(urlToLoadAttribute);
  removeEventListener(this, onImageLoad);
  this.parentElement.parentElement.classList.remove('toLoad');
  this.parentElement.parentElement.classList.add('loaded');
  lazyLoadImages();
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

  function onProductClick() {
    console.log(this);
  }
}
