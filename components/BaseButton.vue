<script setup lang="ts">
import ProgressIndicator from "./ProgressIndicator.vue";

type Props = {
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
  disabled?: boolean;
};

withDefaults(defineProps<Props>(), {
  variant: "primary",
  loading: false,
  disabled: false,
});
</script>

<template>
  <button
    class="relative box-border w-fit flex items-center justify-center rounded-full border-none px-8 py-3 uppercase outline-none ring-none focus:outline-none focus:ring-none"
    :class="{
      'bg-gradient-to-r from-primary to-secondary transition ease-in-out text-white':
        variant === 'primary',
      'bg-surface-container transition ease-in-out text-white':
        variant === 'secondary',
      'bg-error transition ease-in-out text-white': variant === 'danger',
      'hover:scale-[1.05] hover:active:scale-[0.97] cursor-pointer':
        !loading && !disabled,
      'opacity-50 cursor-not-allowed': disabled,
    }"
    :disabled="disabled || loading"
  >
    <div
      v-if="loading"
      class="absolute left-0 top-0 h-full w-full flex items-center justify-center"
    >
      <ProgressIndicator class="scale-[0.75]" />
    </div>

    <span
      :class="{
        invisible: loading,
      }"
    >
      <slot />
    </span>
  </button>
</template>
