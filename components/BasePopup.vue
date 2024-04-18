<script setup lang="ts">
const model = defineModel<boolean>({ default: false });
</script>

<template>
  <div class="popup relative">
    <slot name="target" />
    <div v-if="model" class="content absolute left-0 top-100%">
      <slot />
    </div>
  </div>
</template>
