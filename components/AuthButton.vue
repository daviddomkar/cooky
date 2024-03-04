<script setup lang="ts">
type Props = {
  active: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  active: true,
});

const activeAuthButton = computed(() => {
  const defaultClass =
    "authbutton relative box-border h-24 w-64 flex items-center justify-center rounded-l-full border-none bg-surface px-8 py-3 text-2xl  uppercase cursor-pointer ";
  return (
    defaultClass +
    (props.active
      ? "bg-transparent text-white"
      : "bg-surface after:absolute before:absolute after:right-0 before:right-0 after:h-16 after:w-16 before:h-16 before:w-16 text-on-surface after:bg-surface before:bg-surface after:content-[''] before:content-[''] after:-bottom-16 before:-top-16")
  );
});
</script>

<template>
  <button :class="activeAuthButton">
    <span>
      <slot />
    </span>
  </button>
</template>

<style scoped>
.authbutton::before {
  --g: #0000 99.8%, #000;
  --r: 64px;
  mask: radial-gradient(var(--r) at 0 0, var(--g)) 0 0;
  mask-size: 100% 100%;
  mask-repeat: no-repeat;
}
.authbutton::after {
  --g: #0000 99.8%, #000;
  --r: 64px;
  mask: radial-gradient(var(--r) at 0 100%, var(--g)) 0 100%;
  mask-size: 100% 100%;
  mask-repeat: no-repeat;
}
</style>
```
