const [name, email, message, checkbox, btn] = document.forms[0];
const form = document.getElementsByTagName('form')[0];
let isAuthMode = false;
const auth = document.getElementById('casassa').addEventListener('click', (ev) => {
  if (ev.ctrlKey) {
    isAuthMode = !isAuthMode;
    btn.disabled = false;
  }
});
name.addEventListener('input', validateForm);
email.addEventListener('input', validateForm);
message.addEventListener('input', validateForm);
checkbox.addEventListener('click', validateForm);

setTimeout(() => {
  form.reset();
}, 500);

form.onsubmit = (e) => {
  if (isAuthMode) {
    e.preventDefault();
    return access(name.value, email.value);
  }
  if (validateForm()) {
    form.setAttribute('action', `https://formspree.io/f/${formSpreeFormId}`);
    return true;
  }
  form.classList.add('invalid-sub');
  return false;
};

function validateForm() {
  if (
    name.validity.valid &&
    email.validity.valid &&
    message.validity.valid &&
    checkbox.validity.valid
  ) {
    btn.disabled = false;
    return true;
  } else {
    btn.disabled = true;
    return false;
  }
}

function access(n, e) {
  firebase
    .auth()
    .signInWithEmailAndPassword(n, e)
    .then((userCredential) => {
      sessionStorage.setItem('isAuthenticated', 'true');
      window.location.href = window.location.origin + '/admin.html';
    })
    .catch((error) => {
      alert(error.code, error.message);
    });
}
