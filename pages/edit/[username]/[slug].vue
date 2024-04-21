<script setup lang="ts">
import { useNotification } from "@kyvg/vue3-notification";
import type { Output, Input } from "valibot";
import { FetchError } from "ofetch";
import { RecipeState } from "@prisma/client";

definePageMeta({
  middleware: "auth",
});

const route = useRoute();
const router = useRouter();

const { notify } = useNotification();

const { data: recipe, error } = await useFetch(
  `/api/recipes/${route.params.username}/${route.params.slug}`,
);

if (error.value) {
  throw createError({
    statusCode: error.value?.statusCode,
    statusMessage: error.value?.statusMessage,
  });
}

const { data: units } = await useFetch("/api/units");
const { data: categories } = await useFetch("/api/categories");

const submit = async (values: Output<typeof RecipeFormSchema>) => {
  const formData = new FormData();

  formData.append("image", values.image);
  formData.append("json", JSON.stringify({ ...values, image: undefined }));

  try {
    const result = await $fetch(
      `/api/recipes/${route.params.username}/${route.params.slug}`,
      {
        method: "PUT",
        body: formData,
      },
    );

    notify({
      type: "success",
      title: `Recipe ${values.draft ? "saved as draft" : "published"}.`,
      text: "The recipe has been successfully saved.",
    });

    router.replace(`/${result.username}/${result.slug}`);
  } catch (e) {
    if (e instanceof FetchError) {
      notify({
        type: "error",
        title: `Failed to ${values.draft ? "save the recipe as draft" : "publish recipe"}.`,
        text: e.message,
      });
      return;
    }

    notify({
      type: "error",
      title: `Failed to ${values.draft ? "save the recipe as draft" : "publish recipe"}.`,
      text: "An unknown error occurred.",
    });
  }
};

let blob: Blob;

if (import.meta.client) {
  const request = await $fetch(`/api/files/${recipe.value?.imageId}`);
  blob = request as Blob;
}

const initialValues = computed(() => {
  return {
    draft: recipe.value?.state === RecipeState.DRAFT,
    title: recipe.value?.title ?? "",
    preparationDuration:
      recipe.value?.preparationDuration?.split(":")?.slice(0, 2)?.join(":") ??
      "",
    nutritionPerServing: recipe.value?.nutritionPerServing
      ? Number(recipe.value.nutritionPerServing)
      : undefined,
    numberOfServings: recipe.value?.numberOfServings
      ? Number(recipe.value.numberOfServings)
      : undefined,
    categories:
      recipe.value?.categories?.map((category) => category.categoryId) ?? [],
    description: recipe.value?.description ?? "",
    ingredients:
      recipe.value?.ingredients?.map((ingredient) => {
        return {
          ingredient: {
            id: ingredient.ingredientId,
            title: ingredient.ingredient.title,
            unitTypes: ingredient.ingredient.unitTypes,
          },
          amount: Number(ingredient.amount),
          unitId: ingredient.unit.id,
        };
      }) ?? [],
    steps:
      recipe.value?.steps?.map((step) => {
        return {
          title: step.title,
          content: step.content,
        };
      }) ?? [],
  } as Input<typeof RecipeFormSchema>;
});
</script>

<template>
  <main class="mx-auto box-border max-w-336 w-full px-4 py-4 sm:px-8 sm:py-8">
    <RecipeForm
      :categories="categories!"
      :initial-recipe-blob="blob"
      :initial-recipe-image-src="
        recipe?.imageId ? `/api/files/${recipe?.imageId}` : undefined
      "
      :initial-values="initialValues"
      :on-submit="submit"
      :units="units!"
    />
  </main>
</template>
