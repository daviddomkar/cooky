<script setup lang="ts">
type Props = {
  imageId: string;
};

defineProps<Props>();
</script>

<template>
  <div class="relative h-100 overflow-hidden rounded-3xl sm:h-90 sm:w-60">
    <img
      class="block h-full w-full object-cover object-center"
      :src="`/api/files/${imageId}`"
    />
  </div>
</template>
