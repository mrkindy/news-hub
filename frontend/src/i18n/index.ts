import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en.json';
import deTranslations from './locales/de.json';

// Custom language detection that checks localStorage first
const languageDetectorOptions = {
  order: ['localStorage', 'navigator', 'htmlTag'],
  caches: ['localStorage'],
  lookupLocalStorage: 'newsHubLanguage',
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Language detection configuration
    detection: languageDetectorOptions,

    // Fallback language
    fallbackLng: 'en',
    
    // Debug mode (set to false in production)
    debug: import.meta.env.DEV,

    // Interpolation configuration
    interpolation: {
      escapeValue: false, // React already escapes values
    },

    // Translation resources
    resources: {
      en: {
        translation: enTranslations,
      },
      de: {
        translation: deTranslations,
      },
    },

    // Other options
    react: {
      useSuspense: false, // We'll handle loading states manually
    },
  });

export default i18n;
