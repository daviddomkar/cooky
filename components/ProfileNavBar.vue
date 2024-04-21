<script setup lang="ts">
import NuxtLink from "#app/components/nuxt-link";

type Props = {
  username: string;
  showDrafts?: boolean;
};

defineProps<Props>();
</script>

<template>
  <nav class="box-border rounded-6 bg-surface-container">
    <ul
      class="my-0 box-border h-full w-full flex flex-col list-none items-stretch gap-2 p-0.75 sm:flex-row sm:items-center"
    >
      <li class="grow basis-0">
        <BaseButton
          :as="NuxtLink"
          class="bg-surface-container ![background-image:none] !text-on-surface"
          exact-active-class="!bg-gradient-to-r !from-primary !to-secondary !text-white"
          expanded
          :to="`/${username}`"
        >
          Recipes
        </BaseButton>
      </li>
      <li class="grow basis-0">
        <BaseButton
          :as="NuxtLink"
          class="bg-surface-container ![background-image:none] !text-on-surface"
          exact-active-class="!bg-gradient-to-r !from-primary !to-secondary !text-white"
          expanded
          :to="`/${username}/lists`"
        >
          Lists
        </BaseButton>
      </li>
      <li v-if="showDrafts" class="grow basis-0">
        <BaseButton
          :as="NuxtLink"
          class="bg-surface-container ![background-image:none] !text-on-surface"
          exact-active-class="!bg-gradient-to-r !from-primary !to-secondary !text-white"
          expanded
          :to="`/${username}/drafts`"
        >
          Drafts
        </BaseButton>
      </li>
    </ul>
  </nav>
</template>
