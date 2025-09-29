import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import csTranslation from '../../public/locales/cs/translation.json';
import enTranslation from '../../public/locales/en/translation.json';
import csBistroBudex from '../../public/locales/cs/bistroBudex.json';
import enBistroBudex from '../../public/locales/en/bistroBudex.json';

const resources = {
  cs: {
    translation: csTranslation,
    bistroBudex: csBistroBudex
  },
  en: {
    translation: enTranslation,
    bistroBudex: enBistroBudex
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: 'cs', // Default language
    debug: false,

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'berry-food-language'
    },

    interpolation: {
      escapeValue: false // React already does escaping
    },

    react: {
      useSuspense: true
    }
  });

export default i18n;