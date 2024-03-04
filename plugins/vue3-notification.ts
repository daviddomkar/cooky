// eslint-disable-next-line import/no-named-as-default
import Notifications from "@kyvg/vue3-notification";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Notifications);
});
