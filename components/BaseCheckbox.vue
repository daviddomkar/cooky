<script setup lang="ts">

type Props = {
  name: string,
  modelValue: string,
  checked?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  checked: false
});

const { checked: checkState, errorMessage, handleChange } =  useField(
  () => props.name,
  undefined,
  {
    type: "checkbox",
    checkedValue: props.modelValue,
    initialValue: props.checked ? props.modelValue : null,
    validateOnValueUpdate: true,
    syncVModel: true
  }
)
</script>

<template>
  <div class="flex items-center p-2">
  <input
    :checked="checkState"
    class="m-0 mr-2 h-4 w-4 border-1 border-primary rounded-100 border-solid text-primary focus:ring-none"
    :class="{ 'bg-error!': !!errorMessage }"
    type="checkbox"
    :value="modelValue"
    @change="handleChange"/>

    <label
      class="pr-2 text-xs text-outline"
      :class="{ 'text-error!': !!errorMessage }"
    >
    <slot />
    </label>
  </div>
</template>
