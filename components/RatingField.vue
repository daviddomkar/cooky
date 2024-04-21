<script setup lang="ts">
type Props = {
  name: string;
  editable?: boolean;
  controlled?: boolean;
  modelValue?: number;
};

const props = withDefaults(defineProps<Props>(), {
  editable: true,
  controlled: true,
  modelValue: undefined,
});

const { value, handleChange } = useField<number>(() => props.name, undefined, {
  syncVModel: true,
  controlled: props.controlled,
  initialValue: props.modelValue ?? 0,
});

const model = defineModel<number>();

const roundedValue = computed(() => Math.round(value.value * 2) / 2);
const hoverValue = ref<number | null>(null);

const setHoverValue = (value: number) => {
  if (!props.editable) return;
  hoverValue.value = value;
};

const setValue = (value: number) => {
  if (!props.editable) return;

  if (props.controlled) {
    handleChange(value);
  } else {
    model.value = value;
  }
};
</script>

<template>
  <div class="max-w-60 w-60 flex flex-row items-center justify-between">
    <div class="grow">
      <div
        class="group flex flex-row flex-nowrap"
        :class="{
          'cursor-pointer': editable,
        }"
        @mouseleave="hoverValue = null"
      >
        <div
          v-for="i in 5"
          :key="i"
          class="box-border px-1.5 text-xl"
          :class="{
            'pl-0': i === 1,
            'pr-0': i === 5,
          }"
          @click="setValue(i)"
          @mouseover="setHoverValue(i)"
        >
          <div
            class="i-cooky:star relative"
            :class="{
              '!text-primary': roundedValue >= i || hoverValue,
              'group-hover:text-primary': editable && roundedValue >= i,
              'text-on-surface-variant dark:text-outline': roundedValue < i,
              'group-hover:!text-on-surface-variant dark:group-hover:!text-outline':
                hoverValue ? hoverValue < i : false,
            }"
          >
            <div
              v-if="!hoverValue && editable"
              class="absolute inset-0 box-border w-50% overflow-hidden"
            >
              <div
                class="i-cooky:starhalf"
                :class="{
                  'text-primary': roundedValue >= i - 0.5,
                  'text-on-surface-variant dark:text-outline':
                    roundedValue < i - 0.5,
                }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <p
      v-show="hoverValue ?? roundedValue"
      class="my-0 text-nowrap leading-none"
    >
      {{ hoverValue ? hoverValue : roundedValue }} / 5
    </p>
    <slot name="trailing" />
  </div>
</template>
