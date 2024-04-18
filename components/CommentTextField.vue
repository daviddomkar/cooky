<script setup lang="ts">
type Props = {
  username: string;
  profileImageId?: string | null;
};

withDefaults(defineProps<Props>(), {
  profileImageId: undefined,
});

const emit = defineEmits<{
  (e: "submit", value: string): void;
}>();

const content = ref("");
</script>

<template>
  <div class="flex flex-row items-start gap-3">
    <PictureFrame
      borderless
      class="w-5 shrink-0 cursor-pointer sm:w-12"
      :src="getProfileImageUrl(username, profileImageId)"
    />
    <TextField
      v-model="content"
      label="Add a comment..."
      name="comment"
      type="text"
    />
    <BaseButton @click="() => emit('submit', content)">Comment</BaseButton>
  </div>
</template>
