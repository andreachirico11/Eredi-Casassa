const db = firebase.database();
const select = document.getElementsByTagName('select')[0];
const table = document.getElementsByTagName('table')[0];
const empty = document.getElementsByClassName('displayNone')[0];

db.ref('categories').on(
  'value',
  (categoriesSnapshot) => onFetchCategories(categoriesSnapshot.val()),
  console.error
);

function onFetchCategories(categoriesSnapshot) {
  categoriesSnapshot.forEach((category) => {
    const option = createHtmlOption(category);
    select.appendChild(option);
  });
  select.addEventListener('change', onSelectChange);
}

function createHtmlOption(value) {
  const option = document.createElement('option');
  option.value = value;
  option.innerText = value;
  return option;
}

function onSelectChange() {
  db.ref(this.value).on(
    'value',
    (category) => categoryLoaded(category.val()),
    console.error
  );
}

function categoryLoaded(category) {
  removeAllRows();
  if (category) {
    empty.classList.add('displayNone');
    addCategoryToTable(category);
  } else {
    empty.classList.remove('displayNone');
  }
}

function addCategoryToTable(category) {
  category.forEach((object) => {
    table.appendChild(createRowWithCells(object));
  });
}

function createRowWithCells(obj) {
  const row = document.createElement('tr');
  const cell1 = document.createElement('td');
  cell1.innerText = obj.title;
  row.appendChild(cell1);
  const cell2 = document.createElement('td');
  const img = document.createElement('img');
  img.style.width = '50px';
  img.style.height = 'auto';
  img.src = obj.imgUrl;
  cell2.appendChild(img);
  row.appendChild(cell2);
  return row;
}

function removeAllRows() {
  Array.from(table.getElementsByTagName('tr'))
    .filter((tr) => !tr.classList.contains('admin-table-header'))
    .forEach((tr) => {
      tr.remove();
    });
}

document
  .getElementById('admin-form-button')
  .addEventListener('click', () => load());

function load() {
  const form = document.getElementById('admin-form');
  console.log(form.value);
}
