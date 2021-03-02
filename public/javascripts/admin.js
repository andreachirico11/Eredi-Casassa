const db = firebase.database();
const storage = firebase.storage();
const select = document.getElementsByTagName('select')[0];
const table = document.getElementsByTagName('table')[0];
const empty = document.getElementsByClassName('displayNone')[0];
const progressBar = document.getElementById('uploadBar');
const [nameInput, fileInput] = document.getElementsByTagName('input');
const formButton = document.getElementById('admin-form-button');
let task;
/**
 *
 */
db.ref('categories').on(
  'value',
  (categoriesSnapshot) => onFetchCategories(categoriesSnapshot.val()),
  console.error
);

formButton.addEventListener('click', () => load());

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

function load() {
  const title = nameInput.value;
  const file = fileInput.files[0];
  const category = select.value;
  const fileUrl = category + '/' + title + /\.(.+)/.exec(file.name)[0];
  const storageRef = storage.ref(fileUrl);
  task = storageRef.put(file);
  task.on('state_changed', onLoading, console.error, onLoadingComplete);
}

function onLoading(snapshot) {
  progressBar.classList.remove('displayNone');
  const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  progressBar.value = percentage;
}

function onLoadingComplete() {
  progressBar.classList.add('displayNone');
  progressBar.value = 0;
  task.snapshot.ref.getDownloadURL().then(saveFileOnDb).catch(console.error);
}

function saveFileOnDb(imgUrl) {
  const title = nameInput.value;
  const category = select.value;
  db.ref(category + '/').push(
    {
      imgUrl,
      title,
    },
    console.log
  );
  // da finire
}
