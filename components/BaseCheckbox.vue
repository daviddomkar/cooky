<script setup lang="ts">

type Props = {
  name: string,
  value: string
}

const props = defineProps<Props>();

const { handleChange, checked } =  useField(() => props.name, undefined, {
  type: "checkbox",
  checkedValue: props.value
})
</script>

<template>
  <div class="flex items-center p-2">
  <input
    :checked="checked"
    class="m-0 mr-2 h-4 w-4 border-1 border-primary rounded-100 border-solid text-primary ring-primary focus:ring-primary"
    type="checkbox"
    :value="value"
    @change="handleChange"/>

    <label class="pr-2 text-xs text-outline">
    <slot />
    </label>
  </div>
</template>
