<script setup lang="ts">
const { session } = useAuth();
</script>

<template>
  <div class="min-h-screen">
    <AppHeader class="fixed z-10" :user="session?.user"  />
    <div class="box-border pt-16 sm:pt-24">

    </div>
    <slot />
  </div>
</template>
