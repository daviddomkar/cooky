<script setup lang="ts">
const route = useRoute();

const { isMobile } = useDevice();

const { data: recipes } = await useInfiniteScrollFetch(
  window,
  "/api/recipes/drafts",
  {
    query: { username: route.params.username },
  },
);
</script>

<template>
  <div>
    <MasonryWall
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
            :key="item.id"
            :author="item.author"
            :cover-image-id="item.imageId"
            :title="item.title"
          />
        </NuxtLink>
      </template>
    </MasonryWall>
  </div>
</template>
