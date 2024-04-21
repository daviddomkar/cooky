<script setup lang="ts">
import NuxtLink from "#app/components/nuxt-link";
import { useNotification } from "@kyvg/vue3-notification";
import { FetchError } from "ofetch";
import { Visibility } from "@prisma/client";
import type { Input, Output } from "valibot";

const route = useRoute();

const { notify } = useNotification();

const { session } = useAuth();

const { data: lists } = await useInfiniteScrollFetch(window, "/api/lists", {
  query: {
    username: route.params.username,
  },
});

const dialogRef = ref<Input<typeof ListFormSchema> | undefined>();

const isOwnProfile = computed(
  () => session?.value?.user?.username === route.params.username,
);

const createNewList = () => {
  dialogRef.value = {
    id: undefined,
    title: "",
    visibility: Visibility.PRIVATE,
  };
};

const submit = async (list: Output<typeof ListFormSchema>) => {
  try {
    const response = await $fetch("/api/lists", {
      method: "POST",
      body: list,
    });

    notify({
      type: "success",
      title: `List ${list.title} created.`,
      text: "Your list has been successfully created.",
    });

    navigateTo(`/list/${response.id}`);
  } catch (e) {
    if (e instanceof FetchError) {
      notify({
        type: "error",
        title: "Failed to create list.",
        text: e.message,
      });
      return;
    }

    notify({
      type: "error",
      title: "Failed to create list.",
      text: "An unknown error occurred.",
    });
  }
};
</script>

<template>
  <div class="flex flex-col justify-center gap-8">
    <ListFormDialog
      v-if="isOwnProfile"
      v-model="dialogRef"
      :on-submit="submit"
    />
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
