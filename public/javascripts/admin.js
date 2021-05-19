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
        categoryLoadedData = [];
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
          const storageRef = storage.ref(createFileUrl(getFileTitle(), getFile().name));
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
        db.ref(selectedCategory)
          .orderByChild('order')
          .on('value', (category) => tableLoader(extractOrderedData(category)), console.error);
      }

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
            order: getLastOrder(),
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

      function extractOrderedData(snapshot) {
        const output = [];
        snapshot.forEach((el) => {
          const obj = {};
          obj[el.key] = el.val();
          categoryLoadedData.push(obj);
          output.push(obj);
        });
        return output;
      }

      function getLastOrder() {
        const lastObj = categoryLoadedData[categoryLoadedData.length - 1];
        const key = getKeyFromFirebaseStyle(lastObj);
        return lastObj[key].order;
      }

      function addCategoryToTable(category) {
        category.forEach((element) => {
          const key = getKeyFromFirebaseStyle(element);
          table.appendChild(createRowWithCells(element[key], key));
        });
      }

      function getKeyFromFirebaseStyle(obj) {
        return Object.keys(obj)[0];
      }

      function createHtmlOption(value) {
        const option = document.createElement('option');
        option.value = value;
        option.innerText = value;
        return option;
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

      function createArrowButton(id, type) {
        const button = document.createElement('button');
        if (type === 'up') {
          button.innerHTML = '&#11165;';
          button.onclick = function () {
            moveElementUp(id);
          };
        } else {
          button.innerHTML = '&#11167;';
          button.onclick = function () {
            moveElementDown(id);
          };
        }
        return button;
      }

      function createCell() {
        return document.createElement('td');
      }

      // function moveElementUp(id) {
      //   const index = categoryLoadedData.findIndex(
      //     (element) => getKeyFromFirebaseStyle(element) === id
      //   );
      //   const previous = categoryLoadedData[index - 1],
      //     current = categoryLoadedData[index];
      //   if (previous) {
      //     exchangeElementOrdersAndSave(previous, current);
      //   }
      // }

      // function moveElementDown(id) {
      //   const index = categoryLoadedData.findIndex(
      //     (element) => getKeyFromFirebaseStyle(element) === id
      //   );
      //   const next = categoryLoadedData[index + 1],
      //     current = categoryLoadedData[index];
      //   if (next) {
      //     exchangeElementOrdersAndSave(next, current);
      //   }
      // }

      function moveElementUp(id) {
        const current = getCurrent(id);
        let previous;
        if (current) {
          previous = getPreviousOrNext(current[getKeyFromFirebaseStyle(current)].order);
        }
        if (previous) {
          exchangeElementOrdersAndSave(previous, current);
        }
      }

      function moveElementDown(id) {
        const current = getCurrent(id);
        let next;
        if (current) {
          next = getPreviousOrNext(current[getKeyFromFirebaseStyle(current)].order, true);
        }
        if (next) {
          exchangeElementOrdersAndSave(next, current);
        }
      }

      function getCurrent(id) {
        return categoryLoadedData.find((element) => getKeyFromFirebaseStyle(element) === id);
      }

      function getPreviousOrNext(order, next) {
        const orderToFind = order + (next ? 1 : -1);
        return categoryLoadedData.find(
          (element) => element[getKeyFromFirebaseStyle(element)].order === orderToFind
        );
      }

      function exchangeElementOrdersAndSave(el1, el2) {
        const updates = {},
          el1Key = getKeyFromFirebaseStyle(el1),
          el2Key = getKeyFromFirebaseStyle(el2);
        temp = el1[el1Key].order;
        el1[el1Key].order = el2[el2Key].order;
        el2[el2Key].order = temp;
        updates[`/${selectedCategory}/${el1Key}`] = {
          ...el1[el1Key],
        };
        updates[`/${selectedCategory}/${el2Key}`] = {
          ...el2[el2Key],
        };
        updateDb(updates)
          .then(() => {})
          .catch((err) => {
            alert('Errore update');
          });
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

      function removeFromStorage(imgUrl) {
        const ref = storage.ref().child(selectedCategory).child(getFileNameFromUrl(imgUrl));
        return ref.delete();
      }

      function removeFromDb(uid) {
        return db.ref(selectedCategory + '/' + uid).remove();
      }

      function updateDb(updates) {
        return db.ref().update(updates);
      }

      function removeAllRows() {
        Array.from(table.getElementsByTagName('tr'))
          .filter((tr) => !tr.classList.contains('admin-table-header'))
          .forEach((tr) => {
            tr.remove();
          });
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
