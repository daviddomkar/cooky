<script setup lang="ts">
import ProgressIndicator from "./ProgressIndicator.vue";

type Props = {
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
  disabled?: boolean;
  expanded?: boolean;
};

withDefaults(defineProps<Props>(), {
  variant: "primary",
  loading: false,
  disabled: false,
  expanded: false,
});
</script>

<template>
  <button
    class="relative box-border flex items-center justify-center rounded-full border-none px-8 py-3 uppercase outline-none ring-none transition ease-in-out disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-none"
    :class="{
      'bg-gradient-to-r from-primary to-secondary text-white':
        variant === 'primary',
      'bg-surface-container  text-white': variant === 'secondary',
      'bg-error  text-white': variant === 'danger',
      'hover:scale-[1.05] hover:active:scale-[0.97] cursor-pointer':
        !loading && !disabled,
      'cursor-not-allowed': loading,
      'w-fit': !expanded,
      'w-full grow basis-0': expanded,
    }"
    :disabled="disabled"
  >
    <div
      v-if="loading"
      class="absolute left-0 top-0 h-full w-full flex items-center justify-center"
    >
      <ProgressIndicator class="scale-[0.75]" />
    </div>

    <div
      :class="{
        invisible: loading,
      }"
    >
      <slot />
    </div>
  </button>
</template>
