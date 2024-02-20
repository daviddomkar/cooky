<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  backgroundColorOption: "gray" | "gradient";
  textColor: "white" | "black";
  text: string;
  height: 40 | 50;
}>();

const backgroundColorClass = computed(() => {
  if (props.backgroundColorOption === "gray") {
    return "bg-surface-container";
  } else {
    return "bg-gradient-to-r from-primary to-secondary";
  }
});

const textColorClass = computed(() => {
  return props.textColor === "white" ? "text-white" : "text-black";
});

const heightClass = computed(() => {
  return props.height === 40 ? "h-10" : "h-12";
});
</script>

<template>
  <div
    :class="[
      backgroundColorClass,
      textColorClass,
      heightClass,
      'w-fit rounded-[24px] flex items-center justify-center box-border px-6',
    ]"
  >
    <span class="uppercase" :class="textColorClass">{{ text }}</span>
  </div>
</template>
