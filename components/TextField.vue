<script setup lang="ts">
type Props = {
  name: string;
  label: string;
  type?: "text" | "email" | "password" | "number";
  multiline?: boolean;
  min?: number;
  max?: number;
  controlled?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  multiline: false,
  controlled: true,
  min: undefined,
  max: undefined,
});

defineModel<string>();

const { value, errorMessage, handleBlur, handleChange } = useField<
  string | number
>(() => props.name, undefined, {
  validateOnValueUpdate: false,
  syncVModel: true,
  controlled: props.controlled,
});

// This is required in order to prevent 0 value from being considered as empty
const hasValue = computed(
  () => value.value !== null && value.value !== undefined && value.value !== "",
);
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
        'grow-0': !props.multiline,
        grow: props.multiline,
      }"
    >
      <div
        class="peer box-border h-full w-full flex items-center self-start overflow-hidden border-1 rounded-3xl border-solid text-on-surface transition-colors focus-within:border-primary/0 dark:bg-surface-container"
        :class="{
          'border-primary/0': hasValue,
          'border-outline': !hasValue && !errorMessage,
          'border-error': errorMessage,
        }"
      >
        <component
          :is="props.multiline ? 'textarea' : 'input'"
          :id="name"
          class="box-border h-full w-full grow basis-0 resize-none border-none bg-transparent px-6 py-3 text-on-surface focus:outline-none focus:ring-none"
          :max="max"
          :min="min"
          :name="name"
          :type="type"
          :value="value"
          @blur="handleBlur($event, true)"
          @change="handleChange"
          @input="handleChange($event, !!errorMessage)"
        />
        <slot name="trailing" />
      </div>
      <label
        class="pointer-events-none absolute top-4 ml-6 inline-block leading-4 uppercase transition-all peer-focus-within:translate-x-[1px] peer-focus-within:translate-y-[-23.5px] peer-focus-within:text-xs"
        :class="{
          'text-xs translate-y-[-23.5px] translate-x-[1px]': hasValue,
          'text-primary peer-focus-within:text-primary':
            hasValue && !errorMessage,
          'text-outline peer-focus-within:text-primary':
            !hasValue && !errorMessage,
          'text-error peer-focus-within:text-error': errorMessage,
        }"
        :for="name"
      >
        {{ label }}
      </label>
      <fieldset
        class="pointer-events-none absolute bottom-0 left-0 mx-0 box-border h-[calc(100%_+_0.475rem)] w-full border-1 rounded-3xl border-solid p-0 transition-colors"
        :class="{
          'border-primary peer-focus-within:border-primary':
            hasValue && !errorMessage,
          'border-transparent peer-focus-within:border-primary':
            !hasValue && !errorMessage,
          'border-error peer-focus-within:border-error': errorMessage,
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
