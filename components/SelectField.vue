<script
  setup
  lang="ts"
  generic="
    O extends {
      key: string;
      title: string;
      value: V;
    },
    V extends string | number | boolean | object | null | undefined
  "
>
type Props = {
  name: string;
  label: string;
  options: O[];
  multiple?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
});

defineModel<V | V[]>();

const { value, errorMessage, handleChange } = useField<V | V[]>(
  () => props.name,
  undefined,
  {
    syncVModel: true,
  },
);

const hasValue = computed(() => {
  if (props.multiple) {
    return (value.value as V[]).length > 0;
  }

  return !!value.value;
});
</script>

<template>
  <FieldScaffold
    :active="hasValue"
    :error-message="errorMessage"
    :focusable="false"
    :label="label"
    :name="name"
  >
    <HeadlessListbox
      as="div"
      class="h-full w-full focus:outline-none"
      :model-value="value"
      :multiple="multiple"
      @update:model-value="handleChange"
    >
      <HeadlessListboxButton
        class="box-border h-full w-full flex cursor-pointer items-center border-none bg-transparent px-0"
      >
        <div class="grow px-6 py-3 text-left text-on-surface">
          {{
            multiple
              ? (value as V[])
                  .map(
                    (value) =>
                      options.find((option) => option.value === value)?.title,
                  )
                  .join(", ")
              : options.find((option) => option.value === value)?.title
          }}
        </div>
        <BaseButton class="mr-0.75" spread="compact" variant="secondary">
          <div
            class="i-material-symbols:keyboard-arrow-down-rounded h-6 w-6 scale-[1.25]"
          />
        </BaseButton>
      </HeadlessListboxButton>

      <HeadlessListboxOptions as="template">
        <ul
          ref="ingredientsContainerRef"
          class="absolute z-1 my-0 mt-1 max-h-80 w-full list-none overflow-auto rounded-3xl bg-surface pl-0 text-on-surface shadow-2xl dark:bg-surface-container focus:outline-none"
        >
          <HeadlessListboxOption
            v-for="(option, index) in options"
            :key="option.key"
            v-slot="{ selected, active }"
            as="template"
            :value="option.value"
          >
            <li
              class="flex cursor-pointer gap-2 px-6 py-3 text-base focus:outline-none"
              :class="{
                'border-b-1 border-b-outline/50 border-b-solid':
                  index !== options.length - 1,
                'bg-outline/20': active,
                'text-primary': selected,
              }"
            >
              <div class="grow">
                {{ option.title }}
              </div>
              <div
                class="i-material-symbols:check-small-rounded h-6 w-6 scale-[1.25]"
                :class="{
                  invisible: !selected,
                }"
              />
            </li>
          </HeadlessListboxOption>
        </ul>
      </HeadlessListboxOptions>
    </HeadlessListbox>
  </FieldScaffold>
</template>
