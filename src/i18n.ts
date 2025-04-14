import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Recursos para traducciones directamente en el código
const resources = {
  en: {
    translation: {
      navbar: {
        products: 'Our Products',
        about: 'About Us',
        demo: 'Request a Demo',
        signin: 'Sign In',
      },
      home: {
        title: 'Transform Operations Management With Tryvoo',
        subtitle:
          'Optimize the management of activities, resources and assets, even without connectivity for your business',
        demoButton: 'Schedule a Free Demo',
      },
    },
  },
  es: {
    translation: {
      navbar: {
        products: 'Nuestros productos',
        about: 'Conócenos',
        demo: 'Solicita una demo',
        signin: 'Iniciar sesión',
      },
      home: {
        title: 'Transforma la Gestión de Operaciones Con Tryvoo',
        subtitle:
          'Optimiza la gestión de actividades, recursos y activos, incluso sin conectividad para tus negocios',
        demoButton: 'Agenda Una Demo Gratis',
      },
    },
  },
};

i18n
  // Detecta el idioma del usuario
  .use(LanguageDetector)
  // Pasa el i18n a react-i18next
  .use(initReactI18next)
  // Inicializa i18next
  .init({
    resources,
    fallbackLng: 'es',
    debug: true, // Puedes desactivar esto en producción

    interpolation: {
      escapeValue: false, // No es necesario para React/Preact
    },
  });

export default i18n;
