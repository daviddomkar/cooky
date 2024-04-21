<script setup lang="ts">
import NuxtLink from "#app/components/nuxt-link";
import { useNotification } from "@kyvg/vue3-notification";
import { FetchError } from "ofetch";
import type { Output } from "valibot";

const route = useRoute();
const router = useRouter();

const { notify } = useNotification();

const { session } = useAuth();

const { isMobile } = useDevice();

const {
  data: list,
  refresh: refreshList,
  error,
} = await useFetch(`/api/lists/${route.params.id}`);

if (error.value) {
  throw createError({
    statusCode: error.value?.statusCode,
    statusMessage: error.value?.statusMessage,
  });
}

const { data: recipes, refresh: refreshRecipes } = await useInfiniteScrollFetch(
  window,
  "/api/recipes",
  {
    query: { listId: route.params.id },
  },
);

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

const isOwnList = computed(
  () => list.value?.author?.username === session?.value?.user?.username,
);

const isFavoritesList = computed(
  () => session?.value?.user?.favoritesListId === list.value?.id,
);

const remove = (listId: string) => {
  if (listId === list.value?.id) {
    refreshRecipes();
  }
};

const editList = async (newList: Output<typeof ListFormSchema>) => {
  try {
    await $fetch(`/api/lists/${list.value?.id}`, {
      method: "PUT",
      body: newList,
    });

    notify({
      type: "success",
      title: `List ${list.value?.title} edited.`,
      text: "Your list has been successfully edited.",
    });

    refreshList();
  } catch (e) {
    if (e instanceof FetchError) {
      notify({
        type: "error",
        title: "Failed to edit list.",
        text: e.message,
      });
      return;
    }

    notify({
      type: "error",
      title: "Failed to edit list.",
      text: "An unknown error occurred.",
    });
  }
};

const deleteList = async () => {
  try {
    await $fetch(`/api/lists/${list.value?.id}`, {
      method: "DELETE",
    });

    notify({
      type: "success",
      title: `List ${list.value?.title} deleted.`,
      text: "Your list has been successfully deleted.",
    });

    router.replace(`/${session.value?.user.username}/lists`);
  } catch (e) {
    if (e instanceof FetchError) {
      notify({
        type: "error",
        title: "Failed to delete list.",
        text: e.message,
      });
      return;
    }

    notify({
      type: "error",
      title: "Failed to delete list.",
      text: "An unknown error occurred.",
    });
  }
};
</script>

<template>
  <main
    v-if="list"
    class="mx-auto box-border max-w-336 w-full flex flex-col gap-8 px-4 py-4 sm:px-8 sm:py-8"
  >
    <div class="flex flex-col items-center gap-4 lg:flex-row lg:items-start">
      <div class="mx-auto flex flex-col self-stretch gap-2 lg:mx-0 lg:grow">
        <h1
          class="my-0 text-center text-5xl text-on-surface-variant lg:text-left sm:text-6xl"
        >
          {{ list.title }}
        </h1>
        <ProfileLink class="mx-auto self-start lg:mx-0" :user="list.author" />
      </div>
      <div v-if="isOwnList && !isFavoritesList" class="flex gap-2">
        <ListFormDialog :on-submit="editList">
          <template #activator="{ open }">
            <BaseButton
              spread="compact"
              variant="secondary"
              @click="open(list)"
            >
              <div class="i-material-symbols:edit h-6 w-6" />
            </BaseButton>
          </template>
        </ListFormDialog>
        <ConfirmationDialog
          :on-confirm="deleteList"
          :reason="`List ${list.title} will be deleted.`"
        >
          <template #activator="{ open }">
            <BaseButton spread="compact" variant="danger" @click="open">
              <div class="i-material-symbols:delete h-6 w-6" />
            </BaseButton>
          </template>
        </ConfirmationDialog>
      </div>
    </div>
    <div v-if="!recipes?.length" class="flex flex-col items-center">
      <h2 class="mb-4 mt-0 text-center text-3xl text-on-surface-variant">
        {{ `${isOwnList ? "Your" : "This"} list has no recipes yet.` }}
      </h2>
      <BaseButton v-if="isOwnList" :as="NuxtLink" to="/">
        Browse recipes
      </BaseButton>
    </div>
    <MasonryWall
      v-else
      :column-width="256"
      :gap="16"
      :items="recipes"
      :max-columns="4"
      :ssr-columns="isMobile ? 1 : 4"
    >
      <template #default="{ item }">
        <RecipeCard
          :lists="lists!"
          :recipe="item"
          :refresh-lists="refreshLists"
          @remove="remove"
        />
      </template>
    </MasonryWall>
  </main>
</template>
