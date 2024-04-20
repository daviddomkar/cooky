<script setup lang="ts">
type Props = {
  user: {
    username: string;
    name: string;
    profileImageId?: string | null;
  };
};

defineProps<Props>();
</script>

<template>
  <NuxtLink
    class="h-12 flex gap-2 decoration-none transition-transform hover:active:scale-[0.97]"
    :to="`/${user.username}`"
  >
    <PictureFrame
      borderless
      class="inline-block h-12 w-12 rounded-full object-cover align-middle"
      :src="getProfileImageUrl(user.username, user.profileImageId)"
    />
    <div class="overflow-hidden">
      <span class="text-xs text-primary"> @{{ user.username }} </span>
      <h2 class="my-0 grow text-2xl text-on-surface font-display">
        {{ user.name }}
      </h2>
    </div>
  </NuxtLink>
</template>
