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
  <img
    class="block border-8 border-white rounded-full border-solid object-cover shadow-2xl"
    :height="diameter"
    :src="src"
    :width="diameter"
  />
</template>
