<script setup lang="ts">
import { useNotification } from "@kyvg/vue3-notification";
import { type Output } from "valibot";
import { FetchError } from "ofetch";

definePageMeta({
  middleware: "auth",
});

const { notify } = useNotification();

const { data: units } = await useFetch("/api/units");
const { data: categories } = await useFetch("/api/categories");

const submit = async (values: Output<typeof RecipeFormSchema>) => {
  const formData = new FormData();

  formData.append("image", values.image);
  formData.append("json", JSON.stringify({ ...values, image: undefined }));

  try {
    const result = await $fetch("/api/recipes", {
      method: "POST",
      body: formData,
    });

    notify({
      type: "success",
      title: `Recipe ${values.draft ? "saved as draft" : "published"}.`,
      text: "The recipe has been successfully saved.",
    });

    navigateTo(`/${result.username}/${result.slug}`);
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
</script>

<template>
  <main class="mx-auto box-border max-w-336 w-full px-4 py-4 sm:px-8 sm:py-8">
    <RecipeForm
      :categories="categories!"
      :initial-values="
        {
          title: '',
          description: '',
          categories: [],
          ingredients: [
            {
              ingredient: {
                id: undefined,
                title: '',
                unitTypes: [],
              },
            },
          ],
          steps: [
            {
              title: '',
              content: '',
            },
          ],
        } as any
      "
      :on-submit="submit"
      :units="units!"
    />
  </main>
</template>
