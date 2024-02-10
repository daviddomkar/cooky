export default defineNuxtConfig({
  modules: ["@nuxtjs/eslint-module", "@nuxtjs/stylelint-module"],
  eslint: {
    lintOnStart: false,
  },
  stylelint: {
    lintOnStart: false,
  },
  typescript: {
    typeCheck: true,
    strict: true,
  },
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
});
