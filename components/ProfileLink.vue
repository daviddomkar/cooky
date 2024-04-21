<script setup lang="ts">
type Props = {
  small?: boolean;
  dark?: boolean;
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
    class="flex gap-2 decoration-none transition-transform hover:active:scale-[0.97]"
    :class="{
      'h-8': small,
      'h-12': !small,
    }"
    :to="`/${user.username}`"
  >
    <PictureFrame
      borderless
      class="inline-block h-full rounded-full object-cover align-middle"
      :src="getProfileImageUrl(user.username, user.profileImageId)"
    />
    <div class="overflow-hidden">
      <span v-if="!small" class="text-xs text-primary">
        @{{ user.username }}
      </span>
      <h2
        class="my-0 grow text-2xl text-on-surface font-display"
        :class="{
          '!text-white': dark,
        }"
      >
        {{ user.name }}
      </h2>
    </div>
  </NuxtLink>
</template>
