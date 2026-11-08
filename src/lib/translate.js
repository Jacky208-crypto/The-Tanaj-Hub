import { translations } from '../i18n/translations';

// t() for a specific language, independent of the site's current language
// (printed sheets use the class's language, not the teacher's).
export function translator(language) {
  const resolve = (dict, key) => key.split('.').reduce((acc, k) => (acc == null ? acc : acc[k]), dict);
  return (key, params) => {
    let value = resolve(translations[language] || translations.english, key);
    if (value === undefined) value = resolve(translations.english, key);
    return typeof value === 'function' ? value(params || {}) : value ?? key;
  };
}
