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

const emit = defineEmits(["update:active"]);

const setActive = (isActive: boolean) => {
  emit("update:active", isActive);
};
</script>

<template>
  <div class="relative border-none">
    <label
      :class="[
        'absolute left-6 box-border block bg-white text-[#B3B3B3] uppercase transition-all duration-300 ease-in-out',
        props.active ? 'top-2 ' : 'top-4',
      ]"
    >
      {{ label }}
    </label>
    <input
      class="box-border h-12 min-w-80 border-1 border-[#B3B3B3] rounded-3xl px-6 text-black"
      :name="name"
      :type="type"
      :value="value"
      @blur="handleBlur($event, true)"
      @change="handleChange"
      @focus="setActive(true)"
      @input="handleChange($event, !!errorMessage)"
    />
    <label v-if="errorMessage">
      <span class="text-xs text-red">{{ errorMessage }}</span>
    </label>
  </div>
</template>
