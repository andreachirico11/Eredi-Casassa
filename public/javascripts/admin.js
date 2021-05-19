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
      let task,
        selectedCategory,
        categoryLoadedData = {};

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
        selectedCategory = this.value;
        loadCategoryToTable();
      }

      function loadCategoryToTable() {
        db.ref(selectedCategory)
          .orderByChild('order')
          .on(
            'value',
            (category) => {
              saveCategoryLocally(category);
              tableLoader(categoryLoadedData);
            },
            console.error
          );
      }

      function saveCategoryLocally(dbCategory) {
        categoryLoadedData = {};
        dbCategory.forEach((el) => {
          categoryLoadedData[el.key] = el.val();
        });
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

      function removeAllRows() {
        Array.from(table.getElementsByTagName('tr'))
          .filter((tr) => !tr.classList.contains('admin-table-header'))
          .forEach((tr) => {
            tr.remove();
          });
      }

      function addCategoryToTable(category) {
        Object.keys(category).forEach((key) => {
          table.appendChild(createRowWithCells(category[key], key));
        });
      }

      function createRowWithCells(obj, id) {
        const row = document.createElement('tr');
        row.appendChild(createTitleCell(obj.title));
        row.appendChild(createImgCell(obj.imgUrl));
        row.appendChild(createActionCell(obj, id));
        return row;
      }

      function createTitleCell(title) {
        const titleCell = createCell();
        titleCell.innerText = title;
        return titleCell;
      }

      function createImgCell(url) {
        const imgCell = document.createElement('td');
        const img = document.createElement('img');
        img.style.width = '50px';
        img.style.height = 'auto';
        img.src = url;
        imgCell.appendChild(img);
        return imgCell;
      }

      function createActionCell(obj, id) {
        const actionCell = document.createElement('td');
        actionCell.appendChild(createDeleteButton(id, obj.imgUrl));
        actionCell.appendChild(createArrowButton(id, 'up'));
        actionCell.appendChild(createArrowButton(id, 'down'));
        return actionCell;
      }

      function createDeleteButton(id, imgUrl) {
        const button = document.createElement('button');
        button.textContent = 'Elimina';
        button.style.backgroundColor = 'red';
        button.onclick = function () {
          deleteObject(id, imgUrl);
        };
        return button;
      }

      function deleteObject(objId, imgUrl) {
        removeFromDb(objId)
          .then(() => {
            return removeFromStorage(imgUrl);
          })
          .then(() => {
            confirm('Cancellato');
          })
          .catch((err) => {
            alert('Errore eliminazione immagine');
          });
      }

      function removeFromDb(uid) {
        return db.ref(selectedCategory + '/' + uid).remove();
      }

      function removeFromStorage(imgUrl) {
        const ref = storage.ref().child(selectedCategory).child(getFileNameFromUrl(imgUrl));
        return ref.delete();
      }

      function createArrowButton(id, type) {
        const button = document.createElement('button');
        let innerHTML, increment;
        if (type === 'up') {
          innerHTML = '&#11165;';
          increment = -1;
        } else {
          innerHTML = '&#11167;';
          increment = 1;
        }
        button.innerHTML = innerHTML;
        button.onclick = function () {
          exchangeOrder(id, increment);
        };
        return button;
      }

      function exchangeOrder(id, increment) {
        const allKeys = Object.keys(categoryLoadedData),
          currentKeyIndex = allKeys.findIndex((key) => key === id),
          current = { ...categoryLoadedData[allKeys[currentKeyIndex]] },
          preOrNextKeyIndex = currentKeyIndex + increment,
          prevOrNext = { ...categoryLoadedData[allKeys[preOrNextKeyIndex]] };
        if (Object.keys(prevOrNext).length > 0) {
          const updates = {};
          updates[`/${selectedCategory}/${allKeys[currentKeyIndex]}`] = {
            ...current,
            order: prevOrNext.order,
          };
          updates[`/${selectedCategory}/${allKeys[preOrNextKeyIndex]}`] = {
            ...prevOrNext,
            order: current.order,
          };
          updateDb(updates);
        }
      }

      function updateDb(updates) {
        db.ref()
          .update(updates)
          .then((r) => {
            console.log(r);
          })
          .catch(() => alert('Errore update'));
      }

      function createCell() {
        return document.createElement('td');
      }

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
          const storageRef = storage.ref(createFileUrl(getFileTitle(), getFile().name));
          task = storageRef.put(getFile());
          task.on('state_changed', onLoading, onLoadingError, onLoadingComplete);
        }
      });

      function onLoading(snapshot) {
        progressBar.classList.remove('displayNone');
        const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progressBar.value = percentage;
      }

      function onLoadingError(err) {
        alert('Immagine non salvata');
      }

      function onLoadingComplete() {
        progressBar.classList.add('displayNone');
        progressBar.value = 0;
        task.snapshot.ref
          .getDownloadURL()
          .then(saveReferenceOnDb)
          .then(() => {
            confirm('Salvato');
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
            order: getLastOrderAugmented(),
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

      function getLastOrderAugmented() {
        const keys = Object.keys(categoryLoadedData);
        if (keys.length === 0) {
          return 1;
        }
        const lastObj = categoryLoadedData[keys[keys.length - 1]];
        return lastObj.order + 1;
      }

      function createFileUrl(title, fileName) {
        return selectedCategory + '/' + title + /\.(.+)/.exec(fileName)[0];
      }

      function getFileTitle() {
        return document.getElementsByTagName('input')[0].value;
      }

      function getFile() {
        return document.getElementsByTagName('input')[1].files[0];
      }

      function getFileNameFromUrl(url) {
        return /.*%2F(.*?)\?alt/.exec(url)[1];
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
