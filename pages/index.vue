<script setup lang="ts">
const { data: recipesByRating } = await useFetch("/api/recipes/most-rated");

const rows = computed(() => {
  if (!recipesByRating.value) {
    return [];
  }

  const rows = [];
  const countInRow = 10;

  for (let i = 0; i < recipesByRating.value.length; i += countInRow) {
    rows.push(recipesByRating.value.slice(i, i + countInRow));
  }

  return rows;
});

</script>

<template>
  <main class="box-border h-full w-full flex flex-col justify-center gap-8 py-4 sm:py-8">
    <div class="px-4 sm:px-8">
      <h1 class="my-0 text-center text-5xl sm:text-8xl">Hello and Welcome</h1>
      <h2 class="my-0 text-center text-3xl sm:text-5xl">Add | Save | Rate</h2>
    </div>

    <div class="h-112 max-w-full flex flex-col gap-8 md:h-88 sm:h-136">
      <ClientOnly>
        <div
          v-for="(row, index) in rows"
          :key="index"
          :class="{
            'block md:hidden': index === 2,
          }"
        >
          <Vue3Marquee
            clone
            :direction="index % 2 === 0 ? 'reverse' : 'normal'"
            :duration="120"
            pause-on-hover
          >
            <NuxtLink v-for="ratedRecipe in row" :key="ratedRecipe.id" class="block transition-transform hover:active:scale-[0.97]" :to="`/${ratedRecipe.authorUsername}/${ratedRecipe.slug}`">
              <RecipeListCard
                class="mx-4 box-border w-80 sm:w-96"
                :cover-image-id="ratedRecipe.imageId"
                :title="ratedRecipe.title"
              />
            </NuxtLink>
          </Vue3Marquee>
        </div>
      </ClientOnly>
    </div>
  </main>
</template>
