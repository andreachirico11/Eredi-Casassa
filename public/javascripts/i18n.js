const language = 'en';
let t;

getLanguageFile(language)
  .then((lanObject) => {
    const resources = buildResources(language, lanObject);
    return i18next.init({
      lng: language,
      debug: false,
      resources,
    });
  })
  .then(function (tr) {
    t = tr;
    translateAll();
  })
  .catch((e) => {
    return;
  });

function translateAll() {
  translateIfExists(getById('history'), t('navbar.history'));
  translateIfExists(getById('articles'), t('navbar.articles'));
  translateIfExists(getById('contacts'), t('navbar.contacts'));
  translateIfExists(getById('hour'), t('footer.hour'));
  translateIfExists(getById('closureDay'), t('footer.closureDay'));
  translateIfExists(getById('title'), t('history.title'));
  translateIfExists(getById('paragraph'), t('history.paragraph'));
  translateIfExists(getById('cat1'), t('products.cat1'));
  translateIfExists(getById('cat2'), t('products.cat2'));
  translateIfExists(getById('cat3'), t('products.cat3'));
  translateIfExists(getById('cat4'), t('products.cat4'));
  translateIfExists(getById('cat5'), t('products.cat5'));
  translateIfExists(getById('cat6'), t('products.cat6'));
  translateIfExists(getById('cat7'), t('products.cat7'));
  translateIfExists(getById('cat8'), t('products.cat8'));
  translateIfExists(getById('noProds'), t('products.noProds'));
  translateIfExists(getById('form-title'), t('contacts.title'));
  translateIfExists(getById('form1'), t('contacts.form1'));
  translateIfExists(getById('form2'), t('contacts.form2'));
  translateIfExists(getById('form3'), t('contacts.form3'));
  translateIfExists(getById('accept'), t('contacts.accept'));
  translateIfExists(getById('form-button'), t('contacts.form-button'));
}

function getById(id) {
  return document.getElementById('i18n-' + id);
}

function translateIfExists(element, translatedText) {
  if (element) {
    element.innerHTML = translatedText;
  }
}

function getLanguageFile(lang) {
  return fetch(`../languages/${lang}.json`).then((r) => r.json());
}

function buildResources(languageName, langObject) {
  const output = {};
  output[languageName] = {
    translation: langObject,
  };
  return output;
}
