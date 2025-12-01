import 'server-only'
 
const locales = {
  en: () => import('../locales/en.json').then((module) => module.default),
  so: () => import('../locales/so.json').then((module) => module.default),
  ar: () => import('../locales/ar.json').then((module) => module.default),
}
 
export const getLocale = async (locale: 'en' | 'so' | 'ar') =>
  locales[locale]()