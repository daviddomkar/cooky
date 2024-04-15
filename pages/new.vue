<script setup lang="ts">
import { type Output } from "valibot";

definePageMeta({
  middleware: "auth",
});

const { data: units } = await useFetch("/api/units");
const { data: categories } = await useFetch("/api/categories");

const submit = (values: Output<typeof RecipeFormSchema>) => {
  const formData = new FormData();

  formData.append("image", values.image);
  formData.append("json", JSON.stringify({ ...values, image: undefined }));

  // TODO: Submit the form data

  // eslint-disable-next-line no-console
  console.log(values);
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
