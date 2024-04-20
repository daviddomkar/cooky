<script setup lang="ts">
const { session } = useAuth();

const { data } = await useFetch("/api/lists/", {
  query: {
    take: 100,
    username: session.value?.user.username,
  },
});

const lists = computed(() => data.value?.results ?? []);
</script>

<template>
  <HeadlessPopover class="relative">
    <HeadlessPopoverButton as="template">
      <slot name="activator" />
    </HeadlessPopoverButton>

    <HeadlessPopoverPanel
      class="absolute right-0 mt-1 max-h-80 w-80 overflow-auto rounded-3xl bg-surface-container shadow-2xl"
    >
      <ul class="my-0 list-none pl-0">
        <li
          v-for="list in lists"
          :key="list.id"
          class="flex cursor-pointer px-6 py-3 text-base"
        >
          <div class="grow">
            {{ list.title }}
          </div>
          <div
            class="i-material-symbols:check-small-rounded h-6 w-6 scale-[1.25]"
            :class="{
              invisible: false,
            }"
          />
        </li>
      </ul>
    </HeadlessPopoverPanel>
  </HeadlessPopover>
</template>
