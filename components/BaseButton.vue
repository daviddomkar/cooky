<script setup lang="ts">
type Props = {
  variant?: "primary" | "secondary" | "danger" | "transparent";
  density?: "relaxed" | "default" | "compact";
  spread?: "compact" | "default" | "full" | "none";
  loading?: boolean;
  disabled?: boolean;
};

withDefaults(defineProps<Props>(), {
  variant: "primary",
  density: "default",
  compact: false,
  loading: false,
  disabled: false,
  spread: "default",
});
</script>

<template>
  <button
    class="relative box-border flex items-center justify-center rounded-full border-none uppercase outline-none ring-none transition ease-in-out disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-none"
    :class="{
      'h-8 min-w-8': density === 'compact',
      'h-10 min-w-10': density === 'default',
      'h-12 min-w-12': density === 'relaxed',
      'bg-gradient-to-r from-primary to-secondary text-white':
        variant === 'primary',
      'bg-surface-dimmed  text-on-surface-dimmed': variant === 'secondary',
      'bg-error  text-white': variant === 'danger',
      'bg-transparent text-on-surface': variant === 'transparent',
      'hover:active:scale-[0.97] cursor-pointer':
        !loading && !disabled,
      'cursor-not-allowed': loading,
      'w-fit px-0': spread === 'none',
      'w-fit px-4': spread === 'compact',
      'w-fit px-8': spread === 'default',
      'w-full grow basis-0': spread === 'full',
      'gap-2': $slots.icon,
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
      <slot name="icon" />
      <slot />
    </div>
  </button>
</template>
