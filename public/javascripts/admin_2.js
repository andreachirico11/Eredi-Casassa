if (!sessionStorage.getItem('isAuthenticated')) {
  window.stop();
  redirectHome();
}

firebase.auth().onAuthStateChanged(
  function (user) {
    if (!user) {
      redirectHome();
    } else {
      // document
      //   .getElementById('angular')
      //   .setAttribute('database', JSON.stringify(firebase.database()));
    }
  },
  () => {
    redirectHome();
  }
);

function redirectHome() {
  window.location.href = window.location.origin + '/index.html';
}
