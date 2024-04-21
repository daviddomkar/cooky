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
  <NuxtPage />
</template>
