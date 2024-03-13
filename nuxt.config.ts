import { resolve } from "node:path";

export default defineNuxtConfig({
  css: ["~/assets/css/base.css"],
  modules: [
    "@nuxtjs/eslint-module",
    "@nuxtjs/stylelint-module",
    "@unocss/nuxt",
    "@vee-validate/nuxt",
    "@hebilicious/authjs-nuxt",
    "@nuxtjs/color-mode",
  ],
  runtimeConfig: {
    fileStoragePath: process.env.FILE_STORAGE_PATH,
    authJs: {
      secret: process.env.AUTH_SECRET,
    },
    public: {
      authJs: {
        baseUrl: process.env.AUTH_URL,
        verifyClientOnEveryRequest: true,
      },
    },
  },
  alias: {
    cookie: resolve(__dirname, "node_modules/cookie"),
  },
  eslint: {
    lintOnStart: false,
  },
  stylelint: {
    lintOnStart: false,
  },
  typescript: {
    strict: true,
  },
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  veeValidate: {
    autoImports: true,
    componentNames: {
      Form: "VeeForm",
      Field: "VeeField",
      FieldArray: "VeeFieldArray",
      ErrorMessage: "VeeErrorMessage",
    },
  },
  colorMode: {
    preference: "system",
    fallback: "light",
    classPrefix: "",
    classSuffix: "",
    storageKey: "theme",
  },
});
