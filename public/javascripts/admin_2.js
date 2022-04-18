if (!sessionStorage.getItem('isAuthenticated')) {
  window.stop();
  redirectHome();
}

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
  const angularElement = document.getElementById('angular');
  angularElement.addEventListener('newLineAdded', function _(ev) {
    onAngularElementEvent(extractData(ev));
  });
  firebase
    .database()
    .ref('inventario')
    .on('value', (d) => angularElement.setAttribute('data', JSON.stringify(d)), console.error);
}

async function onAngularElementEvent(parsedDatas) {
  await firebase
    .database()
    .ref('inventario')
    .push(parsedDatas)
    .then((x) => {
      console.log('O K : ');
    })
    .catch(() => alert('Errore update'));
}

function extractData(ev) {
  return JSON.parse(ev.detail);
}

function redirectHome() {
  window.location.href = window.location.origin + '/index.html';
}
