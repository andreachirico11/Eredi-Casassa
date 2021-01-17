const categoryTemplate = document.getElementById('category-template');
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
  products.forEach((prod) => {
    container.appendChild(configureProduct(prod));
  });
}

function noProductFound() {
  const template = document.createElement('h1');
  template.id = 'noProdFound';
  template.textContent = 'No Product Found';
  container.appendChild(template);
}

function redirectToProducts() {
  window.location.href = window.location.origin + '/products.html';
}

// function addCategoryProductsToView(category) {
//   const products = category.products;
//   if (products.length === 0) {
//     noProductFound();
//   }
//   products.forEach((prod) => {
//     container.appendChild(configureProduct(prod));
//   });
// }

// function extractCategoryFromDb(db) {
//   return db.filter((category) => category.categoryName === categoryParam)[0];
// }

// window.onload = () => {
//   fetch(url)
//     .then((res) => {
//       if (res.ok) {
//         return res.json();
//       }
//       throw new Error();
//     })
//     .then((db) => {
//       if (db) {
//         const category = extractCategoryFromDb(db);
//         if (!category) {
//           redirectToProducts();
//         }
//         addCategoryProductsToView(category);
//       }
//     })
//     .catch((err) => {
//       redirectToProducts();
//     });
// };
