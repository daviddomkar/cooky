<script setup lang="ts">
import NuxtLink from "#app/components/nuxt-link";

definePageMeta({
  middleware: (to) => {
    const { session } = useAuth();

    if (session.value?.user?.username !== to.params.username) {
      return abortNavigation();
    }
  },
});

const route = useRoute();

const { session } = useAuth();

const { isMobile } = useDevice();

const { data: recipes } = await useInfiniteScrollFetch(
  window,
  "/api/recipes/drafts",
  {
    query: { username: route.params.username },
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

const isOwnProfile = computed(
  () => session?.value?.user?.username === route.params.username,
);
</script>

<template>
  <div class="flex flex-col gap-8">
    <div v-if="!recipes?.length" class="flex flex-col items-center">
      <h2 class="mb-4 mt-0 text-center text-3xl text-on-surface-variant">
        No drafts found.
      </h2>
      <BaseButton :as="NuxtLink" to="/new">Create new recipe draft</BaseButton>
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
        <NuxtLink
          class="block transition-transform hover:active:scale-[0.97]"
          :to="`/${item.author.username}/${item.slug}`"
        >
          <RecipeCard
            :lists="lists!"
            :recipe="item"
            :refresh-lists="refreshLists"
          />
        </NuxtLink>
      </template>
    </MasonryWall>
    <BaseButton v-if="isOwnProfile && recipes?.length" :as="NuxtLink" to="/new">
      Create new recipe draft
    </BaseButton>
  </div>
</template>
