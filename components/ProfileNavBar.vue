<script setup lang="ts">
import NuxtLink from "#app/components/nuxt-link";

type Props = {
  username: string;
  showDrafts?: boolean;
};

defineProps<Props>();
</script>

<template>
  <nav
    class="box-border border-1 border-outline rounded-6 border-solid bg-surface-container"
  >
    <ul
      class="my-0 box-border h-full w-full flex flex-col list-none items-stretch gap-2 p-0.75 sm:flex-row sm:items-center"
    >
      <li class="grow basis-0">
        <BaseButton
          :as="NuxtLink"
          class="bg-surface ![background-image:none]"
          exact-active-class="!bg-gradient-to-r !from-primary !to-secondary"
          expanded
          :to="`/${username}`"
        >
          Recipes
        </BaseButton>
      </li>
      <li class="grow basis-0">
        <BaseButton
          :as="NuxtLink"
          class="bg-surface ![background-image:none]"
          exact-active-class="!bg-gradient-to-r !from-primary !to-secondary"
          expanded
          :to="`/${username}/lists`"
        >
          Lists
        </BaseButton>
      </li>
      <li v-if="showDrafts" class="grow basis-0">
        <BaseButton
          :as="NuxtLink"
          class="bg-surface ![background-image:none]"
          exact-active-class="!bg-gradient-to-r !from-primary !to-secondary"
          expanded
          :to="`/${username}/drafts`"
        >
          Drafts
        </BaseButton>
      </li>
    </ul>
  </nav>
</template>
