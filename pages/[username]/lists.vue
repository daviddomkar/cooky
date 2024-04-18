<script setup lang="ts">
const route = useRoute();

const { data: lists } = await useInfiniteScrollFetch(window, "/api/lists", {
  query: {
    username: route.params.username,
  },
});
</script>

<template>
  <div>
    <div class="grid grid-cols-[repeat(auto-fit,_minmax(256px,_auto))] gap-4">
      <NuxtLink
        v-for="list in lists"
        :key="list.id"
        class="block transition-transform hover:active:scale-[0.97]"
        :to="`/list/${list.id}`"
      >
        <RecipeListCard
          :cover-image-id="list.recipes[0]?.recipe?.imageId"
          :title="list.title"
        />
      </NuxtLink>
      <!-- Add empty divs to fill the grid when the amount of lists is low -->
      <div v-if="lists.length < 2" />
      <div v-if="lists.length < 3" />
      <div v-if="lists.length < 4" />
    </div>
  </div>
</template>
