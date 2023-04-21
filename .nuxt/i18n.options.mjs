export const localeCodes = ["en","tr"]

export const localeMessages = {
  "en": [{ key: "../src/locales/en-US.json", load: () => import("../src/locales/en-US.json" /* webpackChunkName: "lang_en_US_json_en_US_json" */) }],
  "tr": [{ key: "../src/locales/tr-TR.json", load: () => import("../src/locales/tr-TR.json" /* webpackChunkName: "lang_tr_TR_json_tr_TR_json" */) }],
}

export const additionalMessages = Object({"en":[],"tr":[],})

export const resolveNuxtI18nOptions = async (context) => {
  const nuxtI18nOptions = Object({})
  const vueI18nOptionsLoader = async (context) => Object({"legacy":false,"locale":"tr","fallbackLocale":"tr","availableLocales":["en","tr"],"messages": Object({}),})
  nuxtI18nOptions.vueI18n = await vueI18nOptionsLoader(context)
  nuxtI18nOptions.locales = [Object({"code":"en","file":"en-US.json","path":"C:/Users/FarmUser/Desktop/CryptoSite/src/locales/en-US.json"}),Object({"code":"tr","file":"tr-TR.json","path":"C:/Users/FarmUser/Desktop/CryptoSite/src/locales/tr-TR.json"})]
  nuxtI18nOptions.defaultLocale = "tr"
  nuxtI18nOptions.defaultDirection = "ltr"
  nuxtI18nOptions.routesNameSeparator = "___"
  nuxtI18nOptions.trailingSlash = false
  nuxtI18nOptions.defaultLocaleRouteNameSuffix = "default"
  nuxtI18nOptions.strategy = "prefix_except_default"
  nuxtI18nOptions.lazy = true
  nuxtI18nOptions.langDir = "locales/"
  nuxtI18nOptions.rootRedirect = null
  nuxtI18nOptions.detectBrowserLanguage = Object({"alwaysRedirect":false,"cookieCrossOrigin":false,"cookieDomain":null,"cookieKey":"i18n_redirected","cookieSecure":false,"fallbackLocale":"","redirectOn":"root","useCookie":true})
  nuxtI18nOptions.differentDomains = false
  nuxtI18nOptions.baseUrl = ""
  nuxtI18nOptions.dynamicRouteParams = false
  nuxtI18nOptions.customRoutes = "page"
  nuxtI18nOptions.pages = Object({})
  nuxtI18nOptions.skipSettingLocaleOnNavigate = false
  nuxtI18nOptions.onBeforeLanguageSwitch = (() => "")
  nuxtI18nOptions.onLanguageSwitched = (() => null)
  nuxtI18nOptions.types = undefined
  nuxtI18nOptions.debug = false
  return nuxtI18nOptions
}

export const nuxtI18nOptionsDefault = Object({vueI18n: undefined,locales: [],defaultLocale: "",defaultDirection: "ltr",routesNameSeparator: "___",trailingSlash: false,defaultLocaleRouteNameSuffix: "default",strategy: "prefix_except_default",lazy: false,langDir: null,rootRedirect: null,detectBrowserLanguage: Object({"alwaysRedirect":false,"cookieCrossOrigin":false,"cookieDomain":null,"cookieKey":"i18n_redirected","cookieSecure":false,"fallbackLocale":"","redirectOn":"root","useCookie":true}),differentDomains: false,baseUrl: "",dynamicRouteParams: false,customRoutes: "page",pages: Object({}),skipSettingLocaleOnNavigate: false,onBeforeLanguageSwitch: (() => ""),onLanguageSwitched: (() => null),types: undefined,debug: false})

export const nuxtI18nInternalOptions = Object({__normalizedLocales: [Object({"code":"en","file":"en-US.json","path":"C:/Users/FarmUser/Desktop/CryptoSite/src/locales/en-US.json"}),Object({"code":"tr","file":"tr-TR.json","path":"C:/Users/FarmUser/Desktop/CryptoSite/src/locales/tr-TR.json"})]})
export const NUXT_I18N_MODULE_ID = "@nuxtjs/i18n"
export const isSSG = false
export const isSSR = true
