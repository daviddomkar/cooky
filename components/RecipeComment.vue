<script setup lang="ts">
type Props = {
  authorName: string;
  authorImageId: string | null;
  createdAt: string;
  content: string;
};

defineProps<Props>();
</script>

<template>
  <div class="flex flex-col items-start gap-3 border-2 border-outline rounded-xl border-solid p-3">
    <div class="flex flex-row items-center gap-3">
      <PictureFrame
        borderless
        class="w-5 cursor-pointer sm:w-8"
        :src="getProfileImageUrl(authorName, authorImageId)"
      />
      <span class="font-bold font-display uppercase">{{ authorName }}</span>
    </div>
    <div class="content">{{ content }}</div>
    <div class="actions flex flex-row items-center gap-1">
      <div class="i-cooky:favourites color-red"></div>{{ 1 }}
      <div class="i-cooky:message ml-5 color-gray"></div>
    </div>
  </div>
</template>
