<script setup lang="ts">
import { type Output } from "valibot";

definePageMeta({
  middleware: "auth",
});

const { data: units } = await useFetch("/api/units");

const submit = (values: Output<typeof RecipeFormSchema>) => {
  console.log(values);
};
</script>

<template>
  <main class="mx-auto box-border max-w-336 w-full px-4 py-4 sm:px-8 sm:py-8">
    <RecipeForm
      :initial-values="
        {
          title: '',
          description: '',
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
      :units="units! as any"
    />
  </main>
</template>
