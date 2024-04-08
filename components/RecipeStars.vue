<script setup lang="ts">
type Props = {
  count: number | null;
};

defineProps<Props>();
</script>

<template>
  <div v-if="count != null" class="stars flex flex-row flex-nowrap items-center gap-3 text-xs">
    <div
      v-for="i in 5"
      :key="i"
      class="relative"
    >
      <div class="i-cooky:star c-gray"></div>
      <div v-if="count + 0.25 >= i" class="i-cooky:star absolute inset-0 c-amber"></div>
      <div v-else-if="count + 0.75 >= i" class="i-cooky:starhalf absolute inset-0 c-amber"></div>
    </div>
    <div class="text-xs">{{ Math.round(count * 2) / 2}} / 5</div>
  </div>
</template>
