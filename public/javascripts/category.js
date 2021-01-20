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
  },
  (err) => {
    redirectToProducts();
  }
);

function configureProduct(product) {
  const category = categoryTemplate.content.cloneNode(true);
  category.querySelectorAll('img')[0].src = product.imgUrl;
  category.querySelectorAll('img')[0].alt = product.title;
  category.querySelectorAll('span')[0].textContent = product.title;
  return category;
}

function addCategoryProductsToView(products) {
  if (!products || products.length === 0) {
    return noProductFound();
  }
  categoryTitle.textContent =
    categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1);
  products.forEach((prod) => {
    container.appendChild(configureProduct(prod));
  });
}

function noProductFound() {
  container.appendChild(noProductFoundTemplate.content.cloneNode(true));
}

function redirectToProducts() {
  window.location.href = window.location.origin + '/products.html';
}
