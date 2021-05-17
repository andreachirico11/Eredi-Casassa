const categoryTemplate = document.getElementById('category-template');
const noProductFoundTemplate = document.getElementById('no-product-found');
const categoryTitle = document.getElementById('category-title');
const categoryParam = window.location.href.split('?')[1];
const container = document.getElementById('products-container');
const url = '../products/products.json';
const database = firebase.database();

database.ref(categoryParam).on(
  'value',
  (fetchedProducts) => {
    if (!fetchedProducts) {
      return redirectToProducts();
    }
    addCategoryProductsToView(fetchedProducts.val());
    buildCategoryTitle();
    checkForButtons(); // from scrollButton.js
    translateAll(); // from i18n.js
  },
  (err) => {
    redirectToProducts();
  }
);

function addCategoryProductsToView(products) {
  if (!products || products.length === 0) {
    return noProductFound();
  }
  for (const key in products) {
    container.appendChild(generateProdHtml(products[key]));
  }
}

function generateProdHtml(product) {
  const prodTemplate = categoryTemplate.content.cloneNode(true);
  prodTemplate.querySelectorAll('img')[0].src = product.imgUrl;
  prodTemplate.querySelectorAll('img')[0].alt = product.title;
  prodTemplate.querySelectorAll('span')[0].textContent = product.title;
  return prodTemplate;
}

function noProductFound() {
  container.appendChild(noProductFoundTemplate.content.cloneNode(true));
}

function redirectToProducts() {
  window.location.href = window.location.origin + '/products.html';
}

function buildCategoryTitle() {
  categoryTitle.innerHTML = `
    <span id="i18n-cat${extractCategoryTitle()}"></span>

  `;
}

function extractCategoryTitle() {
  switch (categoryParam) {
    case 'marina':
      return 1;
    case 'arredamento':
      return 2;
    case 'elettrodomestici':
      return 3;
    case 'elettricità':
      return 4;
    case 'lampadari':
      return 5;
    case 'paralumi':
      return 6;
    case 'ottone':
      return 7;
    case 'riparazioni':
    default:
      return 8;
  }
}
