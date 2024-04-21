<script setup lang="ts">
const { session, signOut } = useAuth();

const { data: categories } = await useFetch("/api/categories");

const route = useRoute();
const router = useRouter();

const logIn = () => {
  router.push("/auth/login");
};

const newRecipe = () => {
  router.push("/new");
};

const search = (query: string) => {
  if (!query) {
    return;
  }

  router.push({
    path: "/search",
    query: { query },
  });
};

const randomRecipeLoading = ref(false);

const randomRecipe = async () => {
  try {
    randomRecipeLoading.value = true;
    const recipe = await $fetch("/api/recipes/random");
    router.push(`/${recipe?.author.username}/${recipe?.slug}`);
  } finally {
    randomRecipeLoading.value = false;
  }
};

const logOut = async () => {
  await signOut({
    callbackUrl: "/",
  });
  navbarOpened.value = false;
};

const navbarOpened = ref(false);

watch(
  () => route.path,
  () => {
    navbarOpened.value = false;
  },
);
</script>

<template>
  <div class="overflow-clip">
    <div
      class="min-h-screen w-[calc(100%_+_15rem)] flex items-stretch md:w-full"
    >
      <div
        class="sticky top-0 max-h-screen shrink-0 transition-transform -translate-x-60 md:translate-x-0 md:overflow-auto"
        :class="{
          '!translate-x-0 overflow-auto': navbarOpened,
        }"
      >
        <NavBar
          :categories="categories!"
          class="min-h-screen"
          :user="session?.user"
          @log-out="logOut"
        />
      </div>
      <div
        class="relative max-w-screen flex grow flex-col transition-transform md:max-w-[calc(100vw_-_15rem)] -translate-x-60 md:translate-x-0"
        :class="{
          '!translate-x-0': navbarOpened,
        }"
      >
        <AppHeader
          class="sticky top-0 z-10 print:hidden"
          :random-recipe-loading="randomRecipeLoading"
          :user="session?.user"
          @log-in="logIn"
          @new="newRecipe"
          @open="navbarOpened = true"
          @random="randomRecipe"
          @search="search"
        />
        <div class="box-border flex grow flex-col items-stretch">
          <slot />
        </div>
        <div
          class="pointer-events-none absolute left-0 top-0 z-20 h-full w-full bg-black opacity-0 md:pointer-events-none md:opacity-0"
          :class="{
            'opacity-50 transition-opacity pointer-events-unset touch-none':
              navbarOpened,
          }"
          @click="navbarOpened = false"
        />
      </div>
    </div>
  </div>
</template>
