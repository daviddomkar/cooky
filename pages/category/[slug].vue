<script setup lang="ts">
const { data: recipesByRating } = await useFetch("/api/recipes/most-rated");

const route = useRoute();
const { isMobile } = useDevice();

const { data: profile } = await useFetch(
  `/api/profile/${route.params.username}`,
);
</script>

<template>
  <main
    class="box-border h-full w-full flex flex-col gap-8 px-4 py-4 sm:px-8 sm:py-8"
  >
    <section class="mx-auto flex gap-12">
      <NuxtLink
        class="block transition-transform hover:active:scale-[0.97]"
        :to="`/${recipesByRating![0].authorUsername}/${recipesByRating![0].slug}`"
      >
        <RecipeListCard
          class="mx-4 box-border w-80 sm:w-96"
          :cover-image-id="recipesByRating![0].imageId"
          :title="recipesByRating![0].title"
        />
      </NuxtLink>
      <NuxtLink
        class="block transition-transform hover:active:scale-[0.97]"
        :to="`/${recipesByRating![1].authorUsername}/${recipesByRating![1].slug}`"
      >
        <RecipeListCard
          class="mx-4 box-border w-80 sm:w-96"
          :cover-image-id="recipesByRating![1].imageId"
          :title="recipesByRating![1].title"
        />
      </NuxtLink>
      <NuxtLink
        class="block transition-transform hover:active:scale-[0.97]"
        :to="`/${recipesByRating![2].authorUsername}/${recipesByRating![2].slug}`"
      >
        <RecipeListCard
          class="mx-4 box-border w-80 sm:w-96"
          :cover-image-id="recipesByRating![2].imageId"
          :title="recipesByRating![2].title"
        />
      </NuxtLink>
    </section>
    <section>
      <h2 class="text-5xl">{{ route.params.slug }}</h2>
      <MasonryWall
        :column-width="256"
        :gap="16"
        :items="profile!.recipes"
        :max-columns="4"
        :ssr-columns="isMobile ? 1 : 4"
      >
        <template #default="{ item }">
          <NuxtLink
            class="block transition-transform hover:active:scale-[0.97]"
            :to="`/${profile!.username}/${item.slug}`"
          >
            <RecipeCard
              :key="item.id"
              :author="{
                username: profile!.username,
                name: profile!.name,
                profileImageId: profile!.profileImageId,
              }"
              :cover-image-id="item.imageId"
              :title="item.title"
            />
          </NuxtLink>
        </template>
      </MasonryWall>
    </section>
  </main>
</template>
