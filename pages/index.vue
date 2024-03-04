<script setup lang="ts">
const { session, status, signOut } = useAuth();
</script>

<template>
  <div class="flex flex-col gap-6">
    <div>Auth Status: {{ status }}</div>
    <div v-if="status === 'authenticated'" class="flex flex-col gap-6">
      <div>Session: {{ session?.user }}</div>
      <BaseButton @click="signOut">Sign Out</BaseButton>
    </div>
    <div v-else class="flex gap-6">
      <NuxtLink class="cursor-pointer text-primary underline" to="/auth/signup">
        Sign Up
      </NuxtLink>
      <NuxtLink class="cursor-pointer text-primary underline" to="/auth/login">
        Log In
      </NuxtLink>
    </div>
  </div>
</template>
