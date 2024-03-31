<script setup lang="ts">
type Props = {
  name: string;
};

const props = defineProps<Props>();

const { checked, errorMessage, handleChange } = useField(
  () => props.name,
  undefined,
  {
    type: "checkbox",
    checkedValue: true,
    uncheckedValue: false,
  },
);

const model = defineModel<boolean>();

watch(
  () => checked?.value,
  (value) => {
    model.value = value;
  },
);
</script>

<template>
  <div class="box-border max-w-80 min-h-8 w-full flex flex-col gap-2 px-6">
    <div class="flex">
      <input
        :id="name"
        :checked="checked"
        class="border-box m-0 border-1 rounded-full border-solid text-primary checked:bg-primary dark:bg-surface-container focus:ring-none"
        :class="{
          'border-error': errorMessage,
          'border-outline': !errorMessage,
        }"
        type="checkbox"
        :value="true"
        @change="handleChange($event)"
      />
      <label class="ml-2 text-xs text-outline" :for="name">
        <slot />
      </label>
    </div>
    <label v-if="errorMessage" class="inline-block text-xs text-error">
      {{ errorMessage }}
    </label>
  </div>
</template>
