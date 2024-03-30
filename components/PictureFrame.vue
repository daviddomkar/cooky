<script setup lang="ts">
type Props = {
  src: string;
  diameter?: number;
  borderless: boolean;
};

withDefaults(defineProps<Props>(), {
  diameter: 256,
  borderless: false,
});
</script>

<template>
  <img
    class="block rounded-full object-cover"
    :class="{
      'border-8 border-solid border-white shadow-2xl': !borderless,
      'border-none': borderless,
    }"
    :height="diameter"
    :src="src"
    :width="diameter"
  />
</template>
