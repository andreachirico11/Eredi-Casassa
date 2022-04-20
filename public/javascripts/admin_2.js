if (!sessionStorage.getItem('isAuthenticated')) {
  window.stop();
  redirectHome();
}

const databaseRef = () => firebase.database().ref('inventario');
const angularElementNewlineEvent = 'newLineAdded';
const angularElementUpdateEvent = 'lineUpdated';
const angularElement = document.getElementById('angular');

firebase.auth().onAuthStateChanged(
  function (user) {
    if (!user) {
      redirectHome();
    } else {
      program();
    }
  },
  () => {
    redirectHome();
  }
);

function program() {
  listenToFirebaseDb(dataChanged);
  listenToNewLineEv();
  listenToUpdateEv();
  window.onbeforeunload = function () {
    removeEventListener(angularElementNewlineEvent, angularElement);
    removeEventListener(angularElementUpdateEvent, angularElement);
  };
}

function listenToFirebaseDb(onDataChange) {
  return databaseRef().on('value', onDataChange, console.error);
}

function listenToNewLineEv() {
  angularElement.addEventListener(angularElementNewlineEvent, onAngularElementEvent);
}

function listenToUpdateEv() {
  angularElement.addEventListener(angularElementUpdateEvent, onUpdateEvent);
}

async function onAngularElementEvent(unparsedDatas) {
  await databaseRef()
    .push(JSON.parse(unparsedDatas.detail))
    .catch(() => alert('Errore add'));
}

async function onUpdateEvent(unparsedDatas) {
  await databaseRef()
    .update(unparsedDatas.detail)
    .catch(() => alert('Errore add'));
}

function dataChanged(d) {
  angularElement.setAttribute('data', JSON.stringify(d));
}

function extractData(ev) {
  return JSON.parse(ev.detail);
}

function redirectHome() {
  window.location.href = window.location.origin + '/index.html';
}
