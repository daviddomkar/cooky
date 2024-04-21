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
  <div class="box-border pb-4 pr-4">
    <div
      class="box-border h-full w-full flex items-center justify-center gap-4 rounded-3xl p-4"
      :class="{
        'bg-error': type === 'error',
        'bg-success': type === 'success',
        'bg-info': type === 'info',
        'bg-warning': type === 'warning',
      }"
    >
      <div
        class="box-border h-12 w-12 shrink-0 text-4xl text-white"
        :class="{
          'i-material-symbols:error-circle-rounded-outline-sharp':
            type === 'error',
          'i-ep:success-filled': type === 'success',
          'i-material-symbols:info-rounded': type === 'info',
          'i-ion-warning': type === 'warning',
        }"
      />

      <div>
        <h2 class="m-0 text-white">{{ title }}</h2>
        <p class="m-0 text-white">{{ content }}</p>
      </div>
    </div>
  </div>
</template>
