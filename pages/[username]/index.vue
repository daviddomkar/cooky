<script setup lang="ts">
import NuxtLink from "#app/components/nuxt-link";

const route = useRoute();

const { isMobile } = useDevice();

const { session } = useAuth();

const { data: recipes } = await useInfiniteScrollFetch(window, "/api/recipes", {
  query: {
    username: route.params.username,
  },
});

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
        {{ `${isOwnProfile ? "Your" : "This"} profile has no recipes yet.` }}
      </h2>
      <BaseButton v-if="isOwnProfile" :as="NuxtLink" to="/new">
        Create new recipe
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
        />
      </template>
    </MasonryWall>
    <BaseButton v-if="isOwnProfile && recipes?.length" :as="NuxtLink" to="/new">
      Create new recipe
    </BaseButton>
  </div>
</template>
