<script setup lang="ts">
type Props = {
  src: string;
  diameter?: number;
};

withDefaults(defineProps<Props>(), {
  diameter: 256,
});
</script>

<template>
  <div
    class="relative overflow-hidden border-8 border-white rounded-full border-solid shadow-2xl"
  >
    <img
      class="block overflow-hidden object-cover"
      :height="diameter"
      :src="src"
      :width="diameter"
    />
    <div v-if="$slots.default" class="absolute left-0 top-0 h-full w-full">
      <slot />
    </div>
  </div>
</template>
