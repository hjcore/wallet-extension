import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './en'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    lng: 'en',
    defaultNS: 'common',
    ns: [...Object.keys(en)],
    resources: {
      en,
    },
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v3',
  })

export default i18n
