<script setup lang="ts">
type Props = {
  src: string;
  diameter: number;
  frameWidth: number;
};

const props = withDefaults(defineProps<Props>(), {
  src: "https://www.homeware.cz/images/clanky/Clanky/palacinky.jpg",
  diameter: 72,
});

const frameWidth = computed(() => {
  return props.diameter + 8;
});
</script>

<template>
  <div class="relative">
    <div
      class="overflow-hidden border-20 border-white rounded-full bg-white"
      :class="`h-${props.diameter} w-${props.diameter}`"
    >
      <img
        alt="Picture"
        class="pointer-events-none h-full w-full select-none object-cover"
        :src="props.src"
      />
    </div>
    <div
      class="absolute rounded-full bg-white shadow-2xl -left-4 -top-4 -z-1"
      :class="`h-${frameWidth} w-${frameWidth}`"
    />
  </div>
</template>
