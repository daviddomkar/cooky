import { resolve } from "node:path";

export default defineNuxtConfig({
  css: ["~/assets/css/base.css"],
  modules: [
    "@nuxtjs/eslint-module",
    "@nuxtjs/stylelint-module",
    "@unocss/nuxt",
    "@hebilicious/authjs-nuxt",
  ],
  runtimeConfig: {
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
});
