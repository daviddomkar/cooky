<script setup lang="ts">
const route = useRoute();

const { session } = useAuth();

const computedQuery = computed(() => route.query.query as string);

const { data } = await useInfiniteScrollFetch(window, "/api/recipes", {
  query: { query: computedQuery },
});

if (!route.query.query) {
  throw createError({
    statusCode: 400,
    message: "'query' query parameter is required",
  });
}

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

const { isMobile } = useDevice();
</script>

<template>
  <main
    class="mx-auto box-border max-w-336 w-full flex flex-col gap-8 px-4 py-4 sm:px-8 sm:py-8"
  >
    <div>
      <h2
        class="mb-4 mt-0 text-center text-4xl text-on-surface-variant lg:text-left sm:text-5xl"
      >
        Search results for "{{ route.query.query }}"
      </h2>
      <MasonryWall
        :column-width="256"
        :gap="16"
        :items="data"
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
    </div>
  </main>
</template>
