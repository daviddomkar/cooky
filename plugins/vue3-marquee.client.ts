// eslint-disable-next-line import/no-named-as-default
import Vue3Marquee from "vue3-marquee";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vue3Marquee, { name: "Vue3Marquee" });
});
