<script setup lang="ts">
type Props = {
  variant?: "display" | "interactive";
};
withDefaults(defineProps<Props>(), {
  variant: "display",
});

const emit = defineEmits<{
  (e: "submit", value: number): void;
}>();

const model = defineModel<number>({ default: 0 });
const ratingRounded = computed(() => Math.round(model.value * 2) / 2);
const ratingHover = ref(ratingRounded.value);

const setRating = (val: number) => {
  model.value = val;
  emit("submit", val);
};
const setRatingHover = (val: number) => {
  ratingHover.value = val;
};
</script>

<template>
  <div
    class="stars group flex flex-row flex-nowrap items-center gap-3"
    :class="{
      'text-xs pointer-events-none': variant == 'display',
      'cursor-pointer text-xl': variant == 'interactive',
    }"
  >
    <div v-for="i in 5" :key="i" class="relative">
      <!-- full star -->
      <div
        class="i-cooky:star c-amber group-hover:c-amber"
        :class="{
          'c-gray': ratingRounded < i,
          'group-hover:c-gray': ratingHover < i,
        }"
        @click="() => setRating(i)"
        @mouseover="() => setRatingHover(i)"
      ></div>
      <!-- half star -->
      <div class="group absolute inset-0 w-50% overflow-hidden">
        <div
          class="i-cooky:starhalf c-amber group-hover:c-amber"
          :class="{
            'c-gray': ratingRounded < i - 0.5,
            'group-hover:c-gray': ratingHover < i - 0.5,
          }"
          @click="() => setRating(i - 0.5)"
          @mouseover="() => setRatingHover(i - 0.5)"
        ></div>
      </div>
    </div>
    <p class="text-nowrap leading-none">{{ ratingRounded }} / 5</p>
  </div>
</template>
