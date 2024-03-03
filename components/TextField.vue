<script setup lang="ts">
type Props = {
  name: string;
  type?: "text" | "email" | "password";
  modelValue?: string;
  label: string;
};

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  modelValue: undefined,
  label: undefined,
});

const { value, errorMessage, handleBlur, handleChange } = useField(
  () => props.name,
  undefined,
  {
    validateOnValueUpdate: false,
    syncVModel: true,
  },
);
</script>

<template>
  <div class="h-16 w-80">
    <div class="relative w-full flex items-center">
      <input
        :id="name"
        class="peer box-border h-12 w-full border-1 rounded-full border-solid px-6 text-on-surface outline-none transition-colors focus:border-primary/0 dark:bg-surface-container focus:outline-none focus:ring-none"
        :class="{
          'border-primary/0 outline-none ring-none': value,
          'border-outline': !value && !errorMessage,
          'border-error': errorMessage,
        }"
        :name="name"
        :type="type"
        :value="value"
        @blur="handleBlur($event, true)"
        @change="handleChange"
        @input="handleChange($event, !!errorMessage)"
      />
      <label
        class="pointer-events-none absolute ml-6 inline-block leading-4 uppercase transition-all peer-focus:translate-x-[1px] peer-focus:translate-y-[-23.5px] peer-focus:text-xs"
        :class="{
          'text-xs translate-y-[-23.5px] translate-x-[1px]': value,
          'text-primary peer-focus:text-primary': value && !errorMessage,
          'text-outline peer-focus:text-primary': !value && !errorMessage,
          'text-error peer-focus:text-error': errorMessage,
        }"
      >
        {{ label }}
      </label>
      <fieldset
        class="pointer-events-none absolute bottom-0 left-0 mx-0 box-border h-[55.5px] w-full border-1 rounded-full border-solid p-0 transition-colors"
        :class="{
          'border-primary peer-focus:border-primary': value && !errorMessage,
          'border-transparent peer-focus:border-primary':
            !value && !errorMessage,
          'border-error peer-focus:border-error': errorMessage,
        }"
      >
        <legend
          class="invisible ml-5 inline-block px-1 text-xs text-outline leading-4 uppercase"
        >
          {{ label }}
        </legend>
      </fieldset>
    </div>
    <label v-if="errorMessage" class="ml-6 text-xs text-error">
      {{ errorMessage }}
    </label>
  </div>
</template>
