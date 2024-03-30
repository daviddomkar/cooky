<script setup lang="ts">
type Props = {
  coverImageId: string;
  title: string;
};

defineProps<Props>();
</script>

<template>
  <div class="relative h-32 overflow-hidden rounded-3xl sm:h-40">
    <div
      class="absolute box-border h-full w-full flex items-center justify-center p-4"
    >
      <h2 class="relative z-1 my-0 text-center text-[1.5rem] text-white leading-8 sm:text-[2rem]">
        {{ title }}
      </h2>
    </div>
    <img
      class="block h-full w-full object-cover object-center brightness-60"
      :src="`/api/files/${coverImageId}`"
    />
  </div>
</template>
