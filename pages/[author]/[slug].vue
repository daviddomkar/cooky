<script setup lang="ts">
import { RecipeState } from "@prisma/client";
import { useNotification } from "@kyvg/vue3-notification";
import { FetchError } from "ofetch";

const route = useRoute();

const { notify } = useNotification();

const { session } = useAuth();

const { data: recipe, error } = await useFetch(
  `/api/recipes/${route.params.author}/${route.params.slug}`,
);

if (error.value) {
  throw createError({
    statusCode: error.value?.statusCode,
    statusMessage: error.value?.statusMessage,
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

const isOwnRecipe = computed(
  () => recipe.value?.author?.username === session?.value?.user?.username,
);

const print = () => {
  window.scrollTo(0, 0);
  window.print();
};

const rate = (value: number) => {
  console.log("rate", value);
};

const deleteRecipe = async () => {
  try {
    await $fetch(
      `/api/recipes/${recipe.value?.author?.username}/${recipe.value?.slug}`,
      {
        method: "DELETE",
      },
    );

    notify({
      type: "success",
      title: `Recipe ${recipe.value?.title} deleted.`,
      text: "Your recipe has been successfully deleted.",
    });

    navigateTo(`/${session.value?.user.username}`);
  } catch (e) {
    if (e instanceof FetchError) {
      notify({
        type: "error",
        title: "Failed to delete recipe.",
        text: e.message,
      });
      return;
    }

    notify({
      type: "error",
      title: "Failed to delete recipe.",
      text: "An unknown error occurred.",
    });
  }
};
</script>

<template>
  <main
    v-if="recipe"
    class="mx-auto box-border max-w-336 w-full flex flex-col gap-8 px-4 py-4 sm:px-8 sm:py-8"
  >
    <div class="flex flex-col items-start gap-8 lg:flex-row">
      <img
        class="block w-full shrink-0 rounded-3xl print:hidden lg:min-w-80 lg:w-80"
        :src="`/api/files/${recipe.imageId}`"
      />
      <div class="mx-auto flex flex-col self-stretch gap-2 lg:mx-0 lg:grow">
        <div
          class="flex flex-col items-center gap-4 lg:flex-row lg:items-start"
        >
          <div class="flex grow flex-col items-center lg:items-start">
            <h1 class="my-0 text-center text-5xl lg:text-left">
              {{ recipe.title }}
            </h1>
            <ProfileLink
              class="mx-auto self-start lg:mx-0"
              :user="recipe.author"
            />
          </div>
          <div v-if="isOwnRecipe" class="flex gap-2">
            <BaseButton spread="compact" variant="secondary">
              <div class="i-material-symbols:edit h-6 w-6" />
            </BaseButton>
            <ConfirmationDialog
              :on-confirm="deleteRecipe"
              :reason="`Recipe ${recipe.title} will be deleted.`"
            >
              <template #activator="{ open }">
                <BaseButton spread="compact" variant="danger" @click="open">
                  <div class="i-material-symbols:delete h-6 w-6" />
                </BaseButton>
              </template>
            </ConfirmationDialog>
          </div>
        </div>
        <RatingField
          v-if="recipe.state !== RecipeState.DRAFT"
          class="mx-auto mt-4 lg:mx-0 print:hidden"
          :controlled="false"
          :editable="!!session && !isOwnRecipe"
          :model-value="recipe.rating ?? undefined"
          name="rating"
          @update:model-value="rate"
        />
        <div class="my-4 flex justify-center lg:justify-left">
          <ul class="my-0 max-w-60 w-60 list-none pl-0">
            <li class="flex items-center">
              <span class="grow text-2xl font-display">PREP TIME</span>
              {{ parseInterval(recipe.preparitionDuration) }}
            </li>
            <li class="flex items-center">
              <span class="grow text-2xl font-display">SERVINGS</span>
              {{ recipe.numberOfServings }}
            </li>
            <li class="flex items-center">
              <span class="grow text-2xl font-display">NUTRITION / SERV</span>
              {{ recipe.nutritionPerServing }} kcal
            </li>
          </ul>
        </div>
        <p class="my-0 whitespace-pre-wrap text-center lg:text-left">
          {{ recipe.description }}
        </p>
        <div
          class="mt-4 flex grow items-end justify-center gap-2 print:hidden lg:justify-end"
        >
          <BaseButton spread="compact" variant="secondary" @click="print">
            <div class="i-cooky:print scale-[1.25]" />
          </BaseButton>
          <ListsPopover
            v-if="session && lists && recipe.state !== RecipeState.DRAFT"
            :lists="lists"
            :recipe="recipe"
            :refresh-lists="refreshLists"
          >
            <template #activator>
              <BaseButton spread="compact">
                <template #icon>
                  <div class="i-cooky:favourites scale-[1.25]" />
                </template>
                Save
              </BaseButton>
            </template>
          </ListsPopover>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-8 lg:flex-row print:flex-row">
      <div class="min-w-80 w-80 flex flex-col print:min-w-50 print:w-50">
        <h2 class="my-0 mb-4 text-3xl text-on-surface-variant">Ingredients</h2>
        <ul class="my-0 list-none pl-0">
          <li
            v-for="(ingredient, i) in recipe!.ingredients"
            :key="i"
            class="mb-4"
          >
            {{ ingredient.amount }} {{ ingredient.unit.abbreviation }}
            {{ ingredient.ingredient.title }}
          </li>
        </ul>
      </div>
      <div class="flex grow basis-0 flex-col">
        <h2 class="my-0 mb-4 text-3xl text-on-surface-variant">Steps</h2>
        <ol class="my-0 p-0 pl-5">
          <li v-for="(step, i) in recipe!.steps" :key="i" class="mb-4">
            {{ step.content }}
          </li>
        </ol>
      </div>
    </div>
    <div
      v-if="recipe.comments.length || session"
      class="flex flex-col print:hidden"
    >
      <h2 class="my-0 mb-4 text-3xl text-on-surface-variant">Comments</h2>
      <CommentCard
        v-if="session"
        :author="{
          name: session.user.name,
          username: session.user.username,
          profileImageId: session.user.profileImageId,
        }"
        class="mb-4"
        :editable="true"
      />
      <ul class="my-0 flex flex-col list-none gap-8 pl-0">
        <li v-for="comment in recipe!.comments" :key="comment.id">
          <CommentCard :author="comment.author" :content="comment.content" />
          <ul
            v-if="comment.replies.length"
            class="mb-0 mt-4 flex flex-col list-none gap-4 pl-14"
          >
            <li v-for="reply in comment.replies" :key="reply.id">
              <CommentCard
                :author="reply.author"
                :content="reply.content"
                :reply="true"
              />
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </main>
</template>
