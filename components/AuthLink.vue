<script setup lang="ts">
type Props = {
  to?: string;
};

defineProps<Props>();
</script>

<template>
  <NuxtLink
    active-class="cooky-auth-button !bg-surface !text-on-surface"
    class="relative box-border h-24 w-64 flex cursor-pointer items-center justify-center rounded-l-full border-none bg-transparent px-8 py-3 text-2xl text-white uppercase decoration-none"
    :to="to"
  >
    <span>
      <slot />
    </span>
  </NuxtLink>
</template>

<style scoped>
.cooky-auth-button::before {
  mask: radial-gradient(64px at 0 0, #0000 99.8%, #000) 0 0;
  mask-size: 100% 100%;
  mask-repeat: no-repeat;
  @apply absolute right-0 h-16 w-16 bg-surface content-[''] -top-16;
}

.cooky-auth-button::after {
  mask: radial-gradient(64px at 0 100%, #0000 99.8%, #000) 0 100%;
  mask-size: 100% 100%;
  mask-repeat: no-repeat;
  @apply absolute right-0 h-16 w-16 bg-surface content-[''] -bottom-16;
}
</style>
