<script setup lang="ts">
type Props = {
  type?: "error" | "success" | "info" | "warning";
  title: string;
  content: string;
};

withDefaults(defineProps<Props>(), {
  type: "info",
});
</script>

<template>
  <div
    class="h-full w-full flex rounded-3xl px-2 py-1"
    :class="{
      'bg-error': type === 'error',
      'bg-success': type === 'success',
      'bg-info': type === 'info',
      'bg-warning': type === 'warning',
    }"
  >
    <div
      class="h-6 w-6 text-4xl text-white"
      :class="{
        'i-material-symbols:error-circle-rounded-outline-sharp':
          type === 'error',
        'i-ep:success-filled': type === 'success',
        'i-material-symbols:info-rounded': type === 'info',
        'i-ion-warning': type === 'warning',
      }"
    />

    <div>
      <h3 class="">{{ title }}</h3>
      <p>{{ content }}</p>
    </div>
  </div>
</template>
