<script setup lang="ts">
definePageMeta({
  middleware: () => {
    const { session } = useAuth();

    if (!session.value || session.value.user.permissions.length === 0) {
      abortNavigation();
    }
  },
});
</script>

<template>
  <main
    class="mx-auto box-border max-w-336 w-full flex flex-col gap-8 px-4 py-4 text-center sm:px-8 sm:py-8"
  >
    <h1 class="my-0 text-5xl"> Welcome to the Cooky administration panel </h1>
    <p class="my-0">
      Use navigation bar on the left side to access admin pages
    </p>
  </main>
</template>
