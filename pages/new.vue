<script setup>
definePageMeta({
  middleware: "auth",
});
</script>

<template>
  <main class="mx-auto box-border max-w-336 w-full px-4 py-4 sm:px-8 sm:py-8">
    <RecipeForm
      :initial-values="{
        title: '',
        description: '',
        ingredients: [
          {
            id: '',
            amount: 1,
          },
        ],
        steps: [
          {
            title: '',
            content: '',
          },
        ],
      }"
    />
  </main>
</template>
