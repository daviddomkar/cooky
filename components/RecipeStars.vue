<script setup lang="ts">
type Props = {
  count: number | null;
};

const props = defineProps<Props>();
</script>

<template>
  <div v-if="props.count !== null" class="stars flex flex-row flex-nowrap items-center gap-3 text-xs">
    <div
      v-for="i in 5"
      :key="i"
      class="relative"
    >
      <div class="i-cooky:star c-gray"></div>
      <div v-if="i < props.count + 0.25" class="i-cooky:star absolute inset-0 c-amber"></div>
      <div v-else-if="i == Math.floor(props.count + 0.75)" class="i-cooky:starhalf absolute inset-0 c-amber"></div>
    </div>
    <div class="text-xs">{{ Math.round(props.count * 2) / 2}} / 5</div>
  </div>
</template>
