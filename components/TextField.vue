<script setup lang="ts">
type Props = {
  name: string;
  type?: "text" | "email" | "password";
  modelValue?: string;
  label: string;

  active?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  modelValue: undefined,
  label: undefined,
  active: false,
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
  <div class="relative w-80">
    <label
      class="relative left-[1px] top-[17px] ml-6 inline-block text-outline leading-4 uppercase"
    >
      {{ label }}
    </label>
    <div class="relative w-full">
      <input
        :id="name"
        class="box-border h-12 w-full border-1 border-gray border-outline rounded-full border-solid px-6 focus:border-primary focus:outline-none focus:ring-none"
        :name="name"
        :type="type"
        :value="value"
        @blur="handleBlur($event, true)"
        @change="handleChange"
        @input="handleChange($event, !!errorMessage)"
      />
      <fieldset
        class="pointer-events-none absolute bottom-0 left-0 mx-0 box-border h-[55.5px] w-full border-1 border-outline rounded-full border-solid p-0"
      >
        <legend class="ml-5 inline-block px-1 text-outline leading-4 uppercase">
          {{ label }}
        </legend>
      </fieldset>
    </div>
    <label class="ml-6 text-xs text-red">This field is required.</label>
  </div>
</template>
