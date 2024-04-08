<script setup lang="ts">
const route = useRoute();

const { data: mostRatedRecipeData } = await useFetch(
  "/api/recipes/most-rated",
  {
    query: { limit: 1 },
  },
);

const { data: mostSavedRecipeData } = await useFetch(
  "/api/recipes/most-saved",
  {
    query: { limit: 1 },
  },
);

const { data: mostRecentRecipeData } = await useFetch("/api/recipes/recent", {
  query: { limit: 1 },
});

const { data: randomRecipe } = await useFetch("/api/recipes/random", {
  query: { category: route.params.slug },
});

const categoryContainerRef = ref<HTMLElement | null>(null);

const query = computed(() => {
  return {
    take: 10,
    category: route.params.slug,
  };
});

const { data: recipes } = useInfiniteScrollFetch<any>(
  "/api/recipes",
  categoryContainerRef,
  query,
);

const mostRatedRecipe = computed(() => mostRatedRecipeData?.value?.[0]);
const mostSavedRecipe = computed(() => mostSavedRecipeData?.value?.[0]);
const mostRecentRecipe = computed(() => mostRecentRecipeData?.value?.[0]);

const specialCardCount = computed(
  () =>
    [randomRecipe, mostRatedRecipe, mostSavedRecipe, mostRecentRecipe].filter(
      (recipe) => !!recipe,
    ).length,
);

const { isMobile } = useDevice();
</script>

<template>
  <main
    class="mx-auto box-border max-w-336 w-full flex flex-col gap-8 px-4 pb-4 sm:px-8 sm:pb-8"
  >
    <div class="grid grid-cols-[repeat(auto-fit,_minmax(256px,_auto))] gap-4">
      <NuxtLink
        v-if="randomRecipe"
        class="block transition-transform hover:active:scale-[0.97]"
        :to="`/${randomRecipe.author.username}/${randomRecipe.slug}`"
      >
        <RecipeListCard
          class="mx-4 box-border w-80 sm:w-96"
          :cover-image-id="randomRecipe.imageId"
          title="Inspiration for you"
        />
      </NuxtLink>
      <NuxtLink
        v-if="mostRatedRecipe"
        class="block transition-transform hover:active:scale-[0.97]"
        :to="`/${mostRatedRecipe.authorUsername}/${mostRatedRecipe.slug}`"
      >
        <RecipeListCard
          class="mx-4 box-border w-80 sm:w-96"
          :cover-image-id="mostRatedRecipe.imageId"
          title="Most rated recipe"
        />
      </NuxtLink>
      <NuxtLink
        v-if="mostSavedRecipe"
        class="block transition-transform hover:active:scale-[0.97]"
        :to="`/${mostSavedRecipe.authorUsername}/${mostSavedRecipe.slug}`"
      >
        <RecipeListCard
          class="mx-4 box-border w-80 sm:w-96"
          :cover-image-id="mostSavedRecipe.imageId"
          title="Most saved recipe"
        />
      </NuxtLink>
      <NuxtLink
        v-if="mostRecentRecipe"
        class="block transition-transform hover:active:scale-[0.97]"
        :to="`/${mostRecentRecipe.authorUsername}/${mostRecentRecipe.slug}`"
      >
        <RecipeListCard
          class="mx-4 box-border w-80 sm:w-96"
          :cover-image-id="mostRecentRecipe.imageId"
          title="Most recent recipe"
        />
      </NuxtLink>
      <!-- Add empty divs to fill the grid when the amount of cards is low -->
      <div v-if="specialCardCount < 1" />
      <div v-if="specialCardCount < 2" />
      <div v-if="specialCardCount < 3" />
      <div v-if="specialCardCount < 4" />
    </div>
    <div ref="categoryContainerRef">
      <h2 class="text-5xl">{{ route.params.slug }}</h2>
      <MasonryWall
        :column-width="256"
        :gap="16"
        :items="recipes!"
        :max-columns="4"
        :ssr-columns="isMobile ? 1 : 4"
      >
        <template #default="{ item }">
          <NuxtLink
            class="block transition-transform hover:active:scale-[0.97]"
            :to="`/${item.authorUsername}/${item.slug}`"
          >
            <RecipeCard
              :key="item.id"
              :author="{
                username: item.authorUsername,
                name: item.authorName,
                profileImageId: item.authorProfileImageId,
              }"
              :cover-image-id="item.imageId"
              :title="item.title"
            />
          </NuxtLink>
        </template>
      </MasonryWall>
    </div>
  </main>
</template>
