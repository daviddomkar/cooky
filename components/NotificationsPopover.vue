<script setup lang="ts">
type Props = {
  notifications: {
    id: string;
    title: string;
    content: string;
  }[];
  readNotification: (id: string) => Promise<void>;
};

const props = defineProps<Props>();

const markingAsRead = ref(false);

const read = async (id: string) => {
  markingAsRead.value = true;

  try {
    await props.readNotification(id);
  } finally {
    markingAsRead.value = false;
  }
};
</script>

<template>
  <HeadlessPopover class="relative">
    <HeadlessPopoverButton as="template">
      <slot name="activator" />
    </HeadlessPopoverButton>

    <HeadlessPopoverPanel
      class="absolute right-0 z-20 mt-1 max-h-120 w-160 overflow-auto rounded-3xl bg-surface-container shadow-2xl"
    >
      <ul class="my-0 list-none pl-0">
        <li
          v-for="(notification, index) in notifications"
          :key="notification.id"
          class="flex cursor-pointer items-center px-6 py-3 text-base"
          :class="{
            'border-b-1 border-b-outline/50 border-b-solid':
              index !== notifications.length - 1,
          }"
        >
          <div class="grow">
            <h1 class="my-0 text-xl">{{ notification.title }}</h1>
            <p class="my-0">{{ notification.content }}</p>
          </div>
          <BaseButton
            class="shrink-0"
            density="compact"
            :disabled="markingAsRead"
            spread="none"
            variant="transparent"
            @click="read(notification.id)"
          >
            <div class="i-material-symbols:close h-6 w-6" />
          </BaseButton>
        </li>
        <li
          v-if="notifications.length === 0"
          class="flex cursor-pointer px-6 py-3 text-base text-outline"
        >
          No notifications right now
        </li>
      </ul>
    </HeadlessPopoverPanel>
  </HeadlessPopover>
</template>
