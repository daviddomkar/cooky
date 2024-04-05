<script setup lang="ts">
const { session } = useAuth();

const { data: categories } = await useFetch("/api/categories");

const route = useRoute();
const router = useRouter();

const logIn = () => {
  router.push("/auth/login");
};

const navbarOpened = ref(false);

watch(() => route.path, () => {
  navbarOpened.value = false;
});
</script>

<template>
  <div class="overflow-clip">
    <div class="min-h-screen w-[calc(100%_+_15rem)] flex items-stretch md:w-full">
      <div
          class="sticky top-0 max-h-screen shrink-0 transition-transform -translate-x-60 md:translate-x-0 md:overflow-auto"
          :class="{
            '!translate-x-0 overflow-auto': navbarOpened,
          }"
      >
        <NavBar
          :categories="categories!"
          class="min-h-screen"
        />
      </div>
      <div
        class="relative grow transition-transform -translate-x-60 md:translate-x-0"
        :class="{
          '!translate-x-0': navbarOpened,
        }"
      >
        <AppHeader class="sticky top-0 z-10" :user="session?.user" @log-in="logIn" @open="navbarOpened = true"  />
        <div class="box-border">
          <slot />

        </div>
        <div
          class="pointer-events-none absolute left-0 top-0 z-20 h-full w-full bg-black opacity-0 md:pointer-events-none md:opacity-0"
          :class="{
            'opacity-50 transition-opacity pointer-events-unset touch-none': navbarOpened,
          }"
          @click="navbarOpened = false"
        />
      </div>
    </div>
  </div>
</template>
