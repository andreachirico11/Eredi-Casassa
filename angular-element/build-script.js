const distLocation = '../public/dist/';
const outputLocation = '../public/javascripts/angular-element.js';
const files = ['main.js', 'polyfills.js', 'runtime.js'].map((f) => distLocation + f);

(async function _() {
  await require('concat')(files, outputLocation);
})();
