<script setup lang="ts">
import NuxtLink from "#app/components/nuxt-link";

const route = useRoute();

const { session } = useAuth();

const { data: lists } = await useInfiniteScrollFetch(window, "/api/lists", {
  query: {
    username: route.params.username,
  },
});

const isOwnProfile = computed(
  () => session?.value?.user?.username === route.params.username,
);

const createNewList = () => {
  // TODO: Implement create new list
  // eslint-disable-next-line no-console
  console.log("Create new list");
};
</script>

<template>
  <div class="flex flex-col justify-center gap-8">
    <div v-if="!lists?.length" class="flex flex-col items-center">
      <h2 class="mb-4 mt-0 text-center text-3xl text-on-surface-variant">
        {{ `${isOwnProfile ? "Your" : "This"} profile has no lists yet.` }}
      </h2>
      <BaseButton v-if="isOwnProfile" @click="createNewList">
        Create new list
      </BaseButton>
    </div>
    <div
      v-else
      class="grid grid-cols-[repeat(auto-fit,_minmax(256px,_auto))] gap-4"
    >
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
    <BaseButton v-if="isOwnProfile && lists?.length" @click="createNewList">
      Create new list
    </BaseButton>
  </div>
</template>
