<script setup lang="ts">
type Props = {
  active: boolean;
  href?: string;
};

defineProps<Props>();
</script>

<template>
  <a
    class="relative box-border h-24 w-64 flex cursor-pointer items-center justify-center rounded-l-full border-none px-8 py-3 text-2xl uppercase decoration-none"
    :class="{
      'cooky-auth-button bg-surface text-on-surface': active,
      'bg-transparent text-white': !active,
    }"
    :href="href"
  >
    <span>
      <slot />
    </span>
  </a>
</template>
