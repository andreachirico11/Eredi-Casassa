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
    checkForButtons(); // da scrollButton.js
  },
  (err) => {
    redirectToProducts();
  }
);

function addCategoryProductsToView(products) {
  categoryTitle.textContent = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1);
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
