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
    class="relative box-border overflow-hidden border-8 border-white rounded-full border-solid bg-black shadow-2xl"
    :style="{ width: `${diameter}px`, height: `${diameter}px` }"
  >
    <img
      class="block h-full w-full overflow-hidden object-cover"
      :src="src"
    />
    <div v-if="$slots.default" class="absolute left-0 top-0 h-full w-full">
      <slot />
    </div>
  </div>
</template>
