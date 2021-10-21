// MODIFY FOR NEW LANGUAGES
class Lang {
  constructor(code, value) {
    this.code = code;
    this.value = value;
  }
}
const langs = (function () {
  return {
    it: new Lang('it', 'Italiano'),
    fr: new Lang('fr', 'Français'),
    en: new Lang('en', 'English'),
  };
})();

//////////////////////////

const htmlSelectEl = document.getElementById('lang-switcher');
const LOCAL_STORAGE_LABEL = 'LANG';
const defaultFallbackLanguage = langs.en;
let translator;

let visualizationLanguage = getFromLocalSt(LOCAL_STORAGE_LABEL, langs) || getBrowserLanguage(langs);

configureAndTranslate(visualizationLanguage.code, defaultFallbackLanguage.code);

if (htmlSelectEl) {
  createSelect(langs, htmlSelectEl, visualizationLanguage);
  adjustFlag(visualizationLanguage.code);
  htmlSelectEl.addEventListener('change', function () {
    visualizationLanguage = langs[this.value];
    addToLocalSt(visualizationLanguage, LOCAL_STORAGE_LABEL);
    configureAndTranslate(visualizationLanguage.code, defaultFallbackLanguage.code);
    adjustFlag(visualizationLanguage.code);
  });
}

function createSelect(languages, select, actuallySelected) {
  if (select) {
    for (const key in languages) {
      const opt = document.createElement('option');
      opt.value = languages[key].code;
      opt.innerHTML = languages[key].value;
      if (languages[key].code === actuallySelected.code) {
        opt.selected = true;
      }
      select.appendChild(opt);
    }
  }
}

function configureAndTranslate(lng, fallbackLng) {
  getLanguageFile(lng)
    .then((lanObject) => {
      const resources = buildResources(lng, lanObject);
      return i18next.init({
        lng,
        fallbackLng,
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
  translateIfExists(getById('cat9'), translator('products.cat9'));
  translateIfExists(getById('noProds'), translator('products.noProds'));
  translateIfExists(getById('form-title'), translator('contacts.form-title'));
  translateIfExists(getById('form1'), translator('contacts.form1'));
  translateIfExists(getById('form2'), translator('contacts.form2'));
  translateIfExists(getById('form3'), translator('contacts.form3'));
  translateIfExists(getById('accept'), translator('contacts.accept'));
  translateIfExists(getById('form-button'), translator('contacts.form-button'));
}

function getBrowserLanguage(langs) {
  let browserLan = window.navigator.language;
  if (browserLan) {
    return langs[extractLang(browserLan)];
  }
  return null;
}

function getLanguageFile(lang) {
  return fetch(`../languages/${lang}.json`)
    .then((r) => r.json())
    .catch(() => loadDefaultLanguage());
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

function addToLocalSt(lang, label) {
  localStorage.setItem(label, lang.code);
}

function getFromLocalSt(label, langs) {
  const locLang = localStorage.getItem(label);
  return locLang ? langs[locLang] : null;
}
