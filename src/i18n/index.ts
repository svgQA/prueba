import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Eliminar
import { general_en } from './general.en';
import { general_es } from './general.es';
import { error_en, error_es } from './error';
import { form_en, form_es } from './form';
import { shift_en, shift_es } from './shift';
import { user_en, user_es } from './user';
import { notification_en, notification_es } from './notification';
import { maps_en, maps_es } from './maps';
import { history_en, history_es } from './history';
import { memos_en, memos_es } from './memos';
import { panic_en, panic_es } from './panic';
import { role_en, role_es } from './role';
import { hero_en, hero_es } from './hero';

// Revisar
import { schedule_en, schedule_es } from './schedule';
// Validos
import { common_en, common_es } from './common';
import { buttons_en, buttons_es } from './button';
import { columns_en, columns_es } from './columns';
import { menus_en, menus_es } from './menus';
import { placeholder_en, placeholder_es } from './placeholder';
import { validation_en, validation_es } from './validation';
import { header_en, header_es } from './header';
import { label_en, label_es } from './label';
import { toast_en, toast_es } from './toast';
import { page_en, page_es } from './page';
import { description_en, description_es } from './description';
import { message_en, message_es } from './message';
import { smartGroup_en, smartGroup_es } from './smart-group';

const resources = {
  en: {
    translation: {
      ...common_en,
      ...buttons_en,
      ...columns_en,
      ...menus_en,
      ...placeholder_en,
      ...validation_en,
      ...header_en,
      ...label_en,
      ...toast_en,
      ...page_en,
      ...description_en,
      ...message_en,
      // Posible Delete
      ...general_en,
      ...error_en,
      ...form_en,
      ...shift_en,
      ...user_en,
      ...notification_en,
      ...user_en,
      ...maps_en,
      ...history_en,
      ...memos_en,
      ...panic_en,
      ...role_en,
      ...hero_en,
      ...schedule_en,
      ...smartGroup_en,
    },
  },
  es: {
    translation: {
      ...common_es,
      ...buttons_es,
      ...columns_es,
      ...menus_es,
      ...placeholder_es,
      ...validation_es,
      ...header_es,
      ...label_es,
      ...toast_es,
      ...page_es,
      ...description_es,
      ...message_es,
      // Posible Delete
      ...general_es,
      ...error_es,
      ...form_es,
      ...shift_es,
      ...user_es,
      ...notification_es,
      ...user_es,
      ...maps_es,
      ...history_es,
      ...memos_es,
      ...panic_es,
      ...role_es,
      ...hero_es,
      ...schedule_es,
      ...smartGroup_es,
    },
  },
};

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources,
  fallbackLng: 'en',
});

export default i18n;
