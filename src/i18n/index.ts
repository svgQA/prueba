import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Eliminar
import { general_en } from './general.en';
import { general_es } from './general.es';
import { error_en, error_es } from './error';
import { notification_en, notification_es } from './notification';
import { maps_en, maps_es } from './maps';
import { history_en, history_es } from './history';
import { panic_en, panic_es } from './panic';
import { role_en, role_es } from './role';
import { hero_en, hero_es } from './hero';
import { smartGroup_en, smartGroup_es } from './smart-group';
import { trybook_en, trybook_es } from './trybook';

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
import { file_en, file_es } from './file';
import { home_en, home_es } from './home';
import { metric_en, metric_es } from './metric';

const resources = {
  en: {
    translation: {
      ...metric_en,
      ...common_en,
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
      ...notification_en,
      ...maps_en,
      ...history_en,
      ...panic_en,
      ...role_en,
      ...hero_en,
      ...home_en,
      ...schedule_en,
      ...smartGroup_en,
      ...trybook_en,
      ...file_en,
      ...buttons_en,
    },
  },
  es: {
    translation: {
      ...common_es,
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
      ...notification_es,
      ...maps_es,
      ...history_es,
      ...panic_es,
      ...role_es,
      ...hero_es,
      ...home_es,
      ...schedule_es,
      ...smartGroup_es,
      ...trybook_es,
      ...file_es,
      ...buttons_es,
      ...metric_es,
    },
  },
};

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources,
  fallbackLng: 'en',
});

export default i18n;
