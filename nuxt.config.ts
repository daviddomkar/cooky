export default defineNuxtConfig({
  css: ["~/assets/css/base.css"],
  modules: [
    "@nuxtjs/eslint-module",
    "@nuxtjs/stylelint-module",
    "@unocss/nuxt",
  ],
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
});
