<script setup lang="ts">
type Props = {
  name: string;
  label: string;
  active?: boolean;
  errorMessage?: string;
  expanded?: boolean;
  focusable?: boolean;
  disabled?: boolean;
};

withDefaults(defineProps<Props>(), {
  active: false,
  errorMessage: undefined,
  expanded: false,
  focusable: true,
  disabled: false,
});
</script>

<template>
  <div
    class="box-border w-full flex flex-col gap-1"
    :class="{
      'pb-4': !errorMessage,
    }"
  >
    <div
      class="relative w-full flex shrink-0 basis-12"
      :class="{
        'grow-0': !expanded,
        grow: expanded,
      }"
    >
      <div
        class="peer box-border h-full w-full flex items-center self-start overflow-hidden border-1 rounded-3xl border-solid text-on-surface transition-colors dark:bg-surface-container"
        :class="{
          'border-primary/0': active,
          'border-outline': !active && !errorMessage,
          'border-error': errorMessage,
          'focus-within:border-error/0': errorMessage && focusable,
          'focus-within:border-primary/0': !errorMessage && focusable,
        }"
      >
        <slot />
      </div>
      <label
        class="pointer-events-none absolute top-4 ml-6 inline-block leading-4 uppercase transition-all"
        :class="{
          'text-xs translate-y-[-23.5px] translate-x-[1px]': active,
          'text-primary': active && !errorMessage && !disabled,
          'text-outline': (!active && !errorMessage) || disabled,
          'text-error': errorMessage,
          'peer-focus-within:text-error': errorMessage && focusable,
          'peer-focus-within:text-primary': !errorMessage && focusable,
          'peer-focus-within:translate-x-[1px] peer-focus-within:translate-y-[-23.5px] peer-focus-within:text-xs':
            focusable,
        }"
        :for="name"
      >
        {{ label }}
      </label>
      <fieldset
        class="pointer-events-none absolute bottom-0 left-0 mx-0 box-border h-[calc(100%_+_0.46rem)] w-full border-1 rounded-3xl border-solid p-0 transition-colors"
        :class="{
          'border-primary': active && !errorMessage && !disabled,
          'border-transparent': !active && !errorMessage,
          'border-outline': active && disabled,
          'border-error': errorMessage,
          'peer-focus-within:border-primary': !errorMessage && focusable,
          'peer-focus-within:border-error': errorMessage && focusable,
        }"
      >
        <legend
          class="invisible ml-5 inline-block px-1 text-xs text-outline leading-4 uppercase"
        >
          {{ label }}
        </legend>
      </fieldset>
    </div>
    <label
      v-if="errorMessage"
      class="inline-block px-6 pb-1 text-xs text-error"
    >
      {{ errorMessage }}
    </label>
  </div>
</template>
