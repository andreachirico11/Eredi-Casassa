firebase.auth().onAuthStateChanged(
  function (user) {
    if (!user) {
      redirectHome();
    } else {
      const db = firebase.database();
      const storage = firebase.storage();
      const select = document.getElementsByTagName('select')[0];
      const table = document.getElementsByTagName('table')[0];
      const empty = document.getElementsByClassName('displayNone')[0];
      const progressBar = document.getElementById('uploadBar');
      const formButton = document.getElementById('admin-form-button');
      let task, selectedCategory;
      /**
       *
       */
      db.ref('categories').on(
        'value',
        (categoriesSnapshot) => onFetchCategories(categoriesSnapshot.val()),
        console.error
      );

      document.getElementById('logout').addEventListener('click', () => {
        firebase
          .auth()
          .signOut()
          .then(() => {
            redirectToHome();
          })
          .catch(console.error);
      });

      formButton.addEventListener('click', () => {
        if (loadFormValidation()) {
          const storageRef = storage.ref(createFileUrl());
          task = storageRef.put(getFile());
          task.on('state_changed', onLoading, onLoadingError, onLoadingComplete);
        }
      });

      function onFetchCategories(categoriesSnapshot) {
        categoriesSnapshot.forEach((category) => {
          const option = createHtmlOption(category);
          select.appendChild(option);
        });
        select.addEventListener('change', onSelectChange);
      }

      function onSelectChange() {
        selectedCategory = this.value;
        loadCategoryToTable();
      }

      function loadCategoryToTable() {
        db.ref(selectedCategory).on('value', (category) => tableLoader(category.val()), console.error);
      }

      function onLoading(snapshot) {
        progressBar.classList.remove('displayNone');
        const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progressBar.value = percentage;
      }

      function onLoadingError(err) {
        alert('Immagine non salvata');
        console.error(err);
      }

      function onLoadingComplete() {
        progressBar.classList.add('displayNone');
        progressBar.value = 0;
        task.snapshot.ref
          .getDownloadURL()
          .then(saveReferenceOnDb)
          .then((saved) => {
            confirm('Salvato');
            console.log(saved);
          })
          .catch((err) => {
            alert('Non salvato su Db');
            console.error(err);
          });
      }

      function saveReferenceOnDb(imgUrl) {
        return db.ref(selectedCategory + '/').push(
          {
            imgUrl,
            title: getFileTitle(),
          },
          function () {
            task = null;
          }
        );
      }

      function loadFormValidation() {
        if (!selectedCategory) {
          alert('manca la categoria');
          return false;
        }
        if (getFile() && getFileTitle()) {
          return true;
        }
        alert('e compilali sti campi');
        return false;
      }

      function tableLoader(category) {
        removeAllRows();
        if (category) {
          empty.classList.add('displayNone');
          addCategoryToTable(category);
        } else {
          empty.classList.remove('displayNone');
        }
      }

      function addCategoryToTable(category) {
        for (const key in category) {
          table.appendChild(createRowWithCells(category[key]));
        }
      }

      function createHtmlOption(value) {
        const option = document.createElement('option');
        option.value = value;
        option.innerText = value;
        return option;
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

      function createFileUrl() {
        return selectedCategory + '/' + getFileTitle() + /\.(.+)/.exec(getFile().name)[0];
      }

      function getFileTitle() {
        return document.getElementsByTagName('input')[0].value;
      }

      function getFile() {
        return document.getElementsByTagName('input')[1].files[0];
      }
    }
  },
  () => {
    redirectHome();
  }
);

function redirectHome() {
  window.location.href = window.location.origin + '/index.html';
}
