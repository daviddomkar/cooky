<script setup lang="ts">
type Props = {
  name: string;
  initialSrc?: string;
  initialBlob?: Blob;
};

defineProps<Props>();
</script>

<template>
  <div class="flex shrink-0 basis-0 flex-col gap-1 pb-4">
    <label
      class="relative box-border h-112 w-full flex shrink-0 flex-col cursor-pointer items-center justify-center gap-2 overflow-hidden border-2 border-outline rounded-3xl border-dashed text-outline transition-colors hover:border-primary hover:text-primary"
      :class="{
        '!h-initial !border-primary !text-primary !border-solid': initialSrc,
      }"
    >
      <img
        v-if="initialSrc"
        alt="Recipe Image"
        class="w-full"
        :src="initialSrc"
      />
    </label>
  </div>
</template>
