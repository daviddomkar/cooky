<script setup lang="ts">
type Props = {
  src: string;
  borderless: boolean;
};

withDefaults(defineProps<Props>(), {
  borderless: false,
});
</script>

<template>
  <div
    class="relative box-border aspect-square min-h-4 min-w-4 overflow-hidden border-8 border-white rounded-full border-solid bg-black shadow-2xl"
    :class="{
      'border-8 border-solid border-white shadow-2xl': !borderless,
      'border-none': borderless,
    }"
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
