import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { general_en } from './general.en';
import { general_es } from './general.es';
import { error_en, error_es } from './error';
import { form_en, form_es } from './form';
import { shift_en, shift_es } from './shift';
import { user_en, user_es } from './user';
import { notification_en, notification_es } from './notification';
import { maps_en, maps_es } from './maps';
import { history_en, history_es } from './history';
import { common_en, common_es } from './common';
import { memos_en, memos_es } from './memos';
import { role_en, role_es } from './role';
import { demo_en, demo_es } from './demo';
import { columns_en, columns_es } from './columns';

// import { notification_en, notification_es } from './notification';
// import { shift_en, shift_es } from './shift';
// import { home_en, home_es } from './home';

const resources = {
  en: {
    translation: {
      ...general_en,
      ...error_en,
      ...form_en,
      ...shift_en,
      ...user_en,
      ...notification_en,
      ...user_en,
      ...maps_en,
      ...history_en,
      ...common_en,
      ...memos_en,
      ...role_en,
      ...demo_en,
      ...columns_en,
      // ...home_en,
    },
  },
  es: {
    translation: {
      ...general_es,
      ...error_es,
      ...form_es,
      ...shift_es,
      ...user_es,
      ...notification_es,
      ...user_es,
      ...maps_es,
      ...history_es,
      ...common_es,
      ...memos_es,
      ...role_es,
      ...demo_es,
      ...columns_es,
      // ...home_es,
    },
  },
};

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources,
  fallbackLng: 'en',
});

export default i18n;
