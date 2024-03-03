<script setup lang="ts">
type Props = {
  name: string;
  modelValue?: boolean;
};

const props = defineProps<Props>();

const { checked, errorMessage, handleChange } = useField(
  () => props.name,
  undefined,
  {
    type: "checkbox",
    syncVModel: true,
    checkedValue: true,
    uncheckedValue: false,
    initialValue: props.modelValue,
  },
);
</script>

<template>
  <div class="box-border max-w-80 min-h-8 w-full flex flex-col gap-2 px-6">
    <div class="flex">
      <input
        :checked="checked"
        class="border-box m-0 border-1 rounded-full border-solid text-primary dark:bg-surface-container checked:bg-primary focus:ring-none"
        :class="{
          'border-error': errorMessage,
          'border-outline': !errorMessage,
        }"
        type="checkbox"
        :value="modelValue"
        @change="handleChange"
      />
      <label class="ml-2 text-xs text-outline">
        <slot />
      </label>
    </div>
    <label v-if="errorMessage" class="inline-block text-xs text-error">
      {{ errorMessage }}
    </label>
  </div>
</template>
