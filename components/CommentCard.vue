<script setup lang="ts">
type Props = {
  author: {
    username: string;
    name: string;
    profileImageId?: string | null;
  };
  content?: string;
  editable?: boolean;
  reply?: boolean;
};

withDefaults(defineProps<Props>(), {
  editable: false,
  reply: false,
  content: undefined,
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <ProfileLink class="self-start" :user="author" />
    <form v-if="editable" class="flex flex-col">
      <TextField
        class="h-32"
        label="Write a comment"
        multiline
        name="comment"
      />
      <BaseButton class="self-end" type="submit">Submit</BaseButton>
    </form>
    <div v-if="content" class="flex flex-col gap-4">
      <p class="my-0 whitespace-pre-wrap">{{ content }}</p>
      <div class="flex items-center gap-4">
        <BaseButton density="compact" spread="none" variant="transparent">
          <template #icon>
            <div class="i-cooky:favourites h-6 w-6" />
          </template>
          {{ 0 }}
        </BaseButton>
        <BaseButton
          v-if="!reply"
          density="compact"
          spread="none"
          variant="transparent"
        >
          <template #icon>
            <div class="i-cooky:message h-6 w-6" />
          </template>
          Reply
        </BaseButton>
      </div>
    </div>
  </div>
</template>
