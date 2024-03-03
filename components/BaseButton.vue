<script setup lang="ts">
import { computed } from "vue";

type Props = {
  variant: "primary" | "secondary" | "text";
};

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
});

const computedClass = computed(() => {
  let defaultClass =
    "flex border-none w-fit rounded-3xl items-center justify-center box-border px-6 py-3 uppercase pointer-events-auto ";

  switch (props.variant) {
    case "primary":
      defaultClass +=
        "bg-gradient-to-r from-primary to-secondary hover:scale-110 transition duration-300 ease-in-out text-white";
      break;
    case "secondary":
      defaultClass +=
        "bg-surface-container hover:scale-110 transition duration-300 ease-in-out text-white";
      break;
    case "text":
      defaultClass +=
        "bg-transparent hover:text-secondary transition duration-300 ease-in-out text-primary";
  }

  return defaultClass;
});
</script>

<template>
  <button :class="computedClass">
    <slot />
  </button>
</template>
