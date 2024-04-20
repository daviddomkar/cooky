<script setup lang="ts">
import NuxtLink from "#app/components/nuxt-link";

definePageMeta({
  middleware: async (to) => {
    try {
      await $fetch(`/api/lists/${to.params.id}`);
    } catch (error) {
      if (error) {
        return abortNavigation(error);
      }
    }
  },
});

const route = useRoute();

const { session } = useAuth();

const { isMobile } = useDevice();

const { data: list } = await useFetch(`/api/lists/${route.params.id}`);

const { data: recipes, refresh: refreshRecipes } = await useInfiniteScrollFetch(
  window,
  "/api/recipes",
  {
    query: { listId: route.params.id },
  },
);

const { data: lists, refresh: refreshLists } = await useAsyncData(
  async () => {
    if (!session.value?.user?.username) {
      return [];
    }

    const data = await $fetch("/api/lists", {
      query: {
        // TODO: This should be a proper pagination
        take: 100,
        username: session.value?.user?.username,
      },
    });

    return data.results;
  },
  {
    watch: [session],
  },
);

const isOwnList = computed(
  () => list.value?.author?.username === session?.value?.user?.username,
);

const remove = (listId: string) => {
  if (listId === list.value?.id) {
    refreshRecipes();
  }
};
</script>

<template>
  <main
    v-if="list"
    class="mx-auto box-border max-w-336 w-full flex flex-col gap-8 px-4 py-4 sm:px-8 sm:py-8"
  >
    <div class="flex flex-col items-center gap-4 lg:flex-row lg:items-start">
      <div class="mx-auto flex flex-col self-stretch gap-2 lg:mx-0 lg:grow">
        <h1
          class="my-0 text-center text-5xl text-on-surface-variant lg:text-left sm:text-6xl"
        >
          {{ list.title }}
        </h1>
        <ProfileLink class="mx-auto self-start lg:mx-0" :user="list.author" />
      </div>
      <div v-if="isOwnList" class="flex gap-2">
        <BaseButton spread="compact" variant="secondary">
          <div class="i-material-symbols:edit h-6 w-6" />
        </BaseButton>
        <BaseButton spread="compact" variant="danger">
          <div class="i-material-symbols:delete h-6 w-6" />
        </BaseButton>
      </div>
    </div>
    <div v-if="!recipes?.length" class="flex flex-col items-center">
      <h2 class="mb-4 mt-0 text-center text-3xl text-on-surface-variant">
        {{ `${isOwnList ? "Your" : "This"} list has no recipes yet.` }}
      </h2>
      <BaseButton v-if="isOwnList" :as="NuxtLink" to="/">
        Browse recipes
      </BaseButton>
    </div>
    <MasonryWall
      v-else
      :column-width="256"
      :gap="16"
      :items="recipes"
      :max-columns="4"
      :ssr-columns="isMobile ? 1 : 4"
    >
      <template #default="{ item }">
        <RecipeCard
          :lists="lists!"
          :recipe="item"
          :refresh-lists="refreshLists"
          @remove="remove"
        />
      </template>
    </MasonryWall>
  </main>
</template>
