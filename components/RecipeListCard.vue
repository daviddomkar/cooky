<script setup lang="ts">
type Props = {
  coverImageId: string;
  title: string;
};

defineProps<Props>();
</script>

<template>
  <div class="relative h-40 overflow-hidden rounded-3xl">
    <div
      class="absolute box-border h-full w-full flex items-center justify-center p-4"
    >
      <h2 class="relative z-1 my-0 text-center text-[2rem] text-white leading-8">
        {{ title }}
      </h2>
    </div>
    <img
      class="block h-full w-full object-cover object-center brightness-60"
      :src="`/api/files/${coverImageId}`"
    />
  </div>
</template>
