<script setup>
definePageMeta({
  middleware: "auth",
});
</script>

<template>
  <main
    class="mx-auto box-border max-w-336 w-full flex flex-col gap-8 px-4 py-4 sm:px-8 sm:py-8"
  >
    <div class="flex gap-4">
      <h1 class="my-0 grow text-5xl">New recipe</h1>
      <BaseButton variant="secondary"> Save as draft </BaseButton>
      <BaseButton> Publish </BaseButton>
    </div>
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
