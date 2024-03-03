<script setup lang="ts">
import { computed } from "vue";

type Props = {
  variant: "primary" | "secondary";
};

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
});

const computedClass = computed(() => {
  let defaultClass =
    "flex border-none w-fit rounded-full items-center justify-center box-border px-8 py-3 uppercase cursor-pointer hover:scale-[1.05] hover:active:scale-[0.97] ";

  switch (props.variant) {
    case "primary":
      defaultClass +=
        "bg-gradient-to-r from-primary to-secondary transition ease-in-out text-white";
      break;
    case "secondary":
      defaultClass += "bg-surface-container transition ease-in-out text-white";
      break;
  }

  return defaultClass;
});
</script>

<template>
  <button :class="computedClass">
    <slot />
  </button>
</template>
