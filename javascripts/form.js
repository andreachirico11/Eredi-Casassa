const [name, email, message, checkbox, btn] = document.forms[0];
const form = document.getElementsByTagName('form')[0];
form.setAttribute('action', 'https://formspree.io/f/mbjppzqd');

form.onsubmit = () => {
  if (validateForm()) {
    // clearForm();
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

function onSub() {
  if (validateForm()) {
    clearForm();
    return true;
  } else {
  }
}

function clearForm() {
  name.value = '';
  email.value = '';
  message.value = '';
  checkbox.checked = false;
}

name.addEventListener('input', validateForm);
email.addEventListener('input', validateForm);
message.addEventListener('input', validateForm);
checkbox.addEventListener('click', validateForm);
