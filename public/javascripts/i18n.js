// MODIFY FOR NEW LANGUAGES
const languages = ['it', 'en', 'fr'];
function getLanguageName(lang) {
  switch (lang) {
    case 'it':
      return 'Italiano';
    case 'fr':
      return 'Français';
    case 'en':
    default:
      return 'English';
  }
}
//////////////////////////

const languageSelect = document.getElementById('lang-switcher');
const LOCAL_STORAGE_LABEL = 'LOCAL_STORAGE_LABEL';
const defaultFallbackLanguage = 'en';
let translator;

let visualizationLanguage = getFromLocalSt() || getBrowserLanguage();

createSelect(languages, languageSelect, visualizationLanguage);
configureAndTranslate();
adjustFlag(visualizationLanguage);

languageSelect.addEventListener('change', onSelectChange);

function createSelect(languages, select, actuallySelected) {
  languages.forEach((lan) => {
    const opt = document.createElement('option');
    opt.value = lan;
    opt.innerHTML = getLanguageName(lan);
    if (lan === actuallySelected) {
      opt.selected = true;
    }
    select.appendChild(opt);
  });
}

function configureAndTranslate() {
  getLanguageFile(visualizationLanguage)
    .then((lanObject) => {
      const resources = buildResources(visualizationLanguage, lanObject);
      return i18next.init({
        lng: visualizationLanguage,
        fallbackLng: defaultFallbackLanguage,
        debug: false,
        resources,
      });
    })
    .then(function (tr) {
      translator = tr;
      translateAll();
    })
    .catch((e) => {
      return;
    });
}

function adjustFlag(selected) {
  document.getElementById('flag').src = `./assets/flags/${selected}.png`;
}

function translateAll() {
  translateIfExists(getById('history'), translator('navbar.history'));
  translateIfExists(getById('articles'), translator('navbar.articles'));
  translateIfExists(getById('contacts'), translator('navbar.contacts'));
  translateIfExists(getById('hour'), translator('footer.hour'));
  translateIfExists(getById('closureDay'), translator('footer.closureDay'));
  translateIfExists(getById('title'), translator('history.title'));
  translateIfExists(getById('paragraph'), translator('history.paragraph'));
  translateIfExists(getById('cat1'), translator('products.cat1'));
  translateIfExists(getById('cat2'), translator('products.cat2'));
  translateIfExists(getById('cat3'), translator('products.cat3'));
  translateIfExists(getById('cat4'), translator('products.cat4'));
  translateIfExists(getById('cat5'), translator('products.cat5'));
  translateIfExists(getById('cat6'), translator('products.cat6'));
  translateIfExists(getById('cat7'), translator('products.cat7'));
  translateIfExists(getById('cat8'), translator('products.cat8'));
  translateIfExists(getById('noProds'), translator('products.noProds'));
  translateIfExists(getById('form-title'), translator('contacts.form-title'));
  translateIfExists(getById('form1'), translator('contacts.form1'));
  translateIfExists(getById('form2'), translator('contacts.form2'));
  translateIfExists(getById('form3'), translator('contacts.form3'));
  translateIfExists(getById('accept'), translator('contacts.accept'));
  translateIfExists(getById('form-button'), translator('contacts.form-button'));
}

function getBrowserLanguage() {
  let browserLan = window.navigator.language;
  if (browserLan) {
    return extractLang(browserLan);
  }
  return null;
}

function getLanguageFile(lang) {
  return fetch(`../languages/${lang}.json`)
    .then((r) => r.json())
    .catch(() => loadDefaultLanguage());
}

function onSelectChange() {
  visualizationLanguage = this.value;
  addToLocalSt(visualizationLanguage);
  configureAndTranslate();
  adjustFlag(visualizationLanguage);
}

function buildResources(languageName, langObject) {
  const output = {};
  output[languageName] = {
    translation: langObject,
  };
  return output;
}

function getById(id) {
  return document.getElementById('i18n-' + id);
}

function translateIfExists(element, translatedText) {
  if (element) {
    element.innerHTML = translatedText;
  }
}

function loadDefaultLanguage() {
  visualizationLanguage = defaultFallbackLanguage;
  return getLanguageFile(defaultFallbackLanguage);
}

function extractLang(browserLan) {
  return browserLan.includes('-') && browserLan.length > 2 ? browserLan.split('-')[0] : browserLan;
}

function addToLocalSt(lang) {
  localStorage.setItem(LOCAL_STORAGE_LABEL, lang);
}

function getFromLocalSt() {
  return localStorage.getItem(LOCAL_STORAGE_LABEL) || null;
}
