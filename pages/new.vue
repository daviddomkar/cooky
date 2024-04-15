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

// For now the method does not need to be async
// eslint-disable-next-line require-await
const submit = async (values: Output<typeof RecipeFormSchema>) => {
  const formData = new FormData();

  formData.append("image", values.image);
  formData.append("json", JSON.stringify({ ...values, image: undefined }));

  try {
    // TODO: Create the endpoint, maybe it should return slug so we can redirect to the new recipe
    // await $fetch("/api/recipes", {
    //   method: "POST",
    //   body: formData,
    // });

    // For now, just log the values
    // eslint-disable-next-line no-console
    console.log(values);
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

  // TODO: Submit the form data
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
