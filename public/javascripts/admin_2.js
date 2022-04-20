const databaseRef = () => firebase.database().ref('inventario');
const angularElementNewlineEvent = 'newLineAdded';
const angularElementUpdateEvent = 'lineUpdated';
const angularElementDeleleteEvent = 'rowDelete';
const angularElement = document.getElementById('angular');

firebase.auth().onAuthStateChanged(
  function (user) {
    if (user) {
      program();
    } else {
      redirectHome();
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
  listenToDeleteEvent();
  window.onbeforeunload = function () {
    removeEventListener(angularElementNewlineEvent, angularElement);
    removeEventListener(angularElementUpdateEvent, angularElement);
    removeEventListener(angularElementDeleleteEvent, angularElement);
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

function listenToDeleteEvent() {
  angularElement.addEventListener(angularElementDeleleteEvent, onDeleteEvent);
}

async function onAngularElementEvent(customEvent) {
  await databaseRef()
    .push(customEvent.detail)
    .catch(() => alert('Errore add'));
}

async function onUpdateEvent(customEvent) {
  await databaseRef()
    .update(customEvent.detail)
    .catch(() => alert('Errore update'));
}

async function onDeleteEvent(customEvent) {
  await databaseRef().child(customEvent.detail).remove();
}

function dataChanged(d) {
  angularElement.setAttribute('data', JSON.stringify(d));
}

function redirectHome() {
  window.location.href = window.location.origin + '/index.html';
}
