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
    class="mx-auto box-border max-w-336 w-full flex flex-col gap-8 px-4 py-4 sm:px-8 sm:py-8"
  >
    <div class="flex flex-col items-center gap-4 lg:flex-row">
      <h1 class="my-0 grow text-center text-5xl lg:text-left">Admin</h1>
    </div>
  </main>
</template>
