<script setup lang="ts">
definePageMeta({
  middleware: async (to) => {
    const { error } = await useFetch(`/api/lists/${to.params.id}`);

    if (error.value?.statusCode === 401) {
      return abortNavigation();
    }
  },
});

const route = useRoute();

const { isMobile } = useDevice();

const { data: list } = await useFetch(`/api/lists/${route.params.id}`);

const { data: recipes } = await useInfiniteScrollFetch(window, "/api/recipes", {
  query: { listId: route.params.id },
});
</script>

<template>
  <main
    class="mx-auto box-border max-w-336 w-full flex flex-col px-4 py-4 sm:px-8 sm:py-8"
  >
    <h2
      class="mb-4 mt-0 text-center text-4xl text-on-surface-variant lg:text-left sm:text-5xl"
    >
      {{ list?.title }}
    </h2>
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
            :author="{
              username: item.author.username,
              name: item.author.name,
              profileImageId: item.author.profileImageId,
            }"
            :cover-image-id="item.imageId"
            :title="item.title"
          />
        </NuxtLink>
      </template>
    </MasonryWall>
  </main>
</template>
