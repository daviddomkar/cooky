<script setup lang="ts">
type Props = {
  name: string;
  label: string;
  type?: "text" | "email" | "password" | "number";
  multiline?: boolean;
  min?: number;
  max?: number;
  disabled?: boolean;
  controlled?: boolean;
  errorMessage?: string;
};

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  multiline: false,
  min: undefined,
  max: undefined,
  disabled: false,
  controlled: true,
  errorMessage: undefined,
});

defineModel<string | number>();

const emit = defineEmits<{
  (e: "blur", event: Event): void;
}>();

const {
  value,
  errorMessage: fieldErrorMessage,
  handleBlur: handleFieldBlur,
  handleChange,
} = useField<string | number>(() => props.name, undefined, {
  validateOnValueUpdate: false,
  syncVModel: true,
  controlled: props.controlled,
});

// This is required in order to prevent 0 value from being considered as empty
const hasValue = computed(
  () => value.value !== null && value.value !== undefined && value.value !== "",
);

const hasError = computed(
  () => !!fieldErrorMessage.value || !!props.errorMessage,
);

const handleBlur = (event: Event, validate: boolean) => {
  handleFieldBlur(event, validate);
  emit("blur", event);
};
</script>

<template>
  <FieldScaffold
    :active="hasValue"
    :disabled="disabled"
    :error-message="fieldErrorMessage ?? errorMessage"
    :expanded="multiline"
    :label="label"
    :name="name"
  >
    <component
      :is="multiline ? 'textarea' : 'input'"
      :id="name"
      class="box-border h-full w-full grow basis-0 resize-none border-none bg-transparent px-6 py-3 text-on-surface focus:outline-none focus:ring-none"
      :class="{
        'text-outline cursor-not-allowed': disabled,
      }"
      :disabled="disabled"
      :max="max"
      :min="min"
      :name="name"
      :type="type"
      :value="value"
      @blur="handleBlur($event, true)"
      @change="handleChange"
      @input="handleChange($event, hasError)"
    />
    <slot name="trailing" />
  </FieldScaffold>
</template>
