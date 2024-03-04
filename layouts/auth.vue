import AuthWelcome from '~/components/AuthWelcome.vue';
<template>
  <div class="min-h-screen flex items-stretch">
    <AuthWelcome class="w-full !hidden !lg:flex">
      <NuxtLink custom to="/auth/signup">
        <template #default="{ href, isActive, navigate }">
          <AuthLink :active="isActive" :href="href" @click="navigate">
            Sign Up
          </AuthLink>
        </template>
      </NuxtLink>
      <NuxtLink custom to="/auth/login">
        <template #default="{ href, isActive, navigate }">
          <AuthLink :active="isActive" :href="href" @click="navigate">
            Log in
          </AuthLink>
        </template>
      </NuxtLink>
    </AuthWelcome>
    <div class="w-full">
      <slot />
    </div>
  </div>
</template>
