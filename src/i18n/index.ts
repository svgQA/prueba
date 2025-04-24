import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { general_en } from './general.en';
import { general_es } from './general.es';
import { error_en } from './error.en';
import { error_es } from './error.es';

const resources = {
  en: {
    translation: {
      ...general_en,
      ...error_en,
    },
  },
  es: {
    translation: {
      ...general_es,
      ...error_es,
    },
  },
};

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources,
  fallbackLng: 'en',
});

export default i18n;
