<script setup lang="ts">
type Props = {
  recipe: {
    title: string;
    slug: string;
    imageId: string;
    author: {
      username: string;
      name: string;
      profileImageId?: string | null;
    };
  };
  lists: {
    id: string;
    title: string;
  }[];
  refreshLists: () => Promise<void>;
};

const emit = defineEmits<{
  (e: "remove", id: string): void;
}>();

defineProps<Props>();

const { session } = useAuth();

const hoveringOverActions = ref(false);
</script>

<template>
  <div
    class="relative block transition-transform"
    :class="{
      'hover:active:scale-[0.97]': !hoveringOverActions,
    }"
  >
    <div class="relative overflow-hidden rounded-3xl">
      <img
        class="block w-full rounded-3xl brightness-70"
        :src="`/api/files/${recipe.imageId}`"
      />
      <NuxtLink
        class="absolute left-0 top-0 z-0 box-border h-full w-full flex flex-col justify-between rounded-3xl p-3 decoration-none after:absolute before:absolute after:bottom-0 after:left-0 before:left-0 before:top-0 after:h-16 after:w-full before:h-16 before:w-full after:from-black before:from-black after:to-transparent before:to-transparent after:bg-gradient-to-t before:bg-gradient-to-b after:opacity-50 before:opacity-50 after:content-[''] before:content-[''] after:-z-1 before:-z-1"
        :to="`/${recipe.author.username}/${recipe.slug}`"
      >
        <h2 class="my-0 text-center text-3xl text-white leading-8">
          {{ recipe.title }}
        </h2>
      </NuxtLink>
    </div>
    <div
      class="absolute bottom-2 left-2"
      @mouseenter="hoveringOverActions = true"
      @mouseleave="hoveringOverActions = false"
    >
      <ProfileLink small :user="recipe.author" />
    </div>
    <div
      v-if="session"
      class="absolute bottom-2 right-2"
      @mouseenter="hoveringOverActions = true"
      @mouseleave="hoveringOverActions = false"
    >
      <ListsPopover
        :lists="lists"
        :recipe="recipe"
        :refresh-lists="refreshLists"
        @remove="emit('remove', $event)"
      >
        <template #activator="{ liked }">
          <BaseButton density="compact" spread="none" variant="transparent">
            <div
              class="i-cooky:favourites h-6 w-6"
              :class="{
                'text-white': !liked,
                'text-red': liked,
              }"
            />
          </BaseButton>
        </template>
      </ListsPopover>
    </div>
  </div>
</template>
