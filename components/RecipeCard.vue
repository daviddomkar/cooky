<script setup lang="ts">
type Props = {
  title: string;
  coverImageId: string;
  author: {
    username: string;
    name: string;
    profileImageId?: string | null;
  };
  liked?: boolean;
};

withDefaults(defineProps<Props>(), {
  liked: false,
});
</script>

<template>
  <div class="relative overflow-hidden rounded-3xl">
    <img
      class="block w-full brightness-60"
      :src="`/api/files/${coverImageId}`"
    />
    <div
      class="absolute left-0 top-0 z-0 box-border h-full w-full flex flex-col justify-between p-3 after:absolute before:absolute after:bottom-0 after:left-0 before:left-0 before:top-0 after:h-16 after:w-full before:h-16 before:w-full after:from-black before:from-black after:to-transparent before:to-transparent after:bg-gradient-to-t before:bg-gradient-to-b after:opacity-50 before:opacity-50 after:content-[''] before:content-[''] after:-z-1 before:-z-1"
    >
      <h2 class="my-0 text-center text-[1.5rem] text-white leading-8 sm:text-[2rem]">{{ title }}</h2>
      <div class="flex items-center">
        <img
          class="h-6 w-6 rounded-full object-cover"
          :src="getProfileImageUrl(author.username, author.profileImageId)"
        />
        <span class="ml-2 grow text-xs text-white">{{ author.name }}</span>
        <div
          class="i-ph-heart-fill h-6 w-6 transition-all duration-300 ease-in-out hover:scale-110"
          :class="{
            'bg-red': liked,
            'bg-gray': !liked,
          }" 
        />
      </div>
    </div>
  </div>
</template>
