<script setup lang="ts">
import BaseButton from "./BaseButton.vue";
import TextField from "./TextField.vue";

type Props = {
  name: string;
  label: string;
};

const props = defineProps<Props>();

type Ingredient = {
  id: string;
  title: string;
  unitTypes: string[];
};

const { value, handleChange: handleFieldChange } = useField<Ingredient | null>(
  () => `${props.name}.ingredient`,
);

const query = ref("");

const queryIngredient = computed(() => {
  return query.value === ""
    ? null
    : { id: null, title: query.value, unitTypes: [] };
});

const ingredientsContainerRef = ref<HTMLElement | null>(null);

const params = computed(() => {
  return {
    take: 10,
    query: query.value,
  };
});

const { data: ingredients } = useInfiniteScrollFetch<Ingredient>(
  "/api/ingredients",
  ingredientsContainerRef,
  params,
);

const handleChange = (ingredient: Ingredient | null) => {
  if (ingredient) {
    query.value = ingredient.title;
  }

  handleFieldChange(ingredient);
};
</script>

<template>
  <div>
    <HeadlessCombobox
      as="div"
      class="relative focus:outline-none"
      immediate
      :model-value="value"
      nullable
      @update:model-value="handleChange"
    >
      <HeadlessComboboxInput as="template">
        <TextField
          :controlled="false"
          :label="label"
          :model-value="query"
          :name="`${name}.query`"
          @update:model-value="query = $event"
        >
          <template v-if="value" #trailing>
            <BaseButton class="mr-0.75" spread="compact" variant="secondary">
              <div class="i-material-symbols:edit h-6 w-6 scale-[0.75]" />
            </BaseButton>
          </template>
        </TextField>
      </HeadlessComboboxInput>

      <HeadlessComboboxOptions as="template">
        <ul
          ref="ingredientsContainerRef"
          class="absolute z-1 my-0 max-h-80 w-full list-none overflow-auto rounded-3xl bg-surface pl-0 text-on-surface shadow-2xl -mt-2 dark:bg-surface-container"
        >
          <HeadlessComboboxOption
            v-for="(ingredient, index) in ingredients"
            :key="ingredient.id"
            class="block cursor-pointer px-6 py-3 text-base"
            :class="{
              'border-b-1 border-b-outline/50 border-b-solid':
                index !== ingredients.length - 1,
            }"
            :value="ingredient"
          >
            {{ ingredient.title }}
          </HeadlessComboboxOption>
          <HeadlessComboboxOption
            v-if="queryIngredient"
            class="cursor-pointer from-primary to-secondary bg-gradient-to-r px-6 py-3 text-base text-white"
            :value="queryIngredient"
          >
            Create "{{ query.trim() }}"
          </HeadlessComboboxOption>
        </ul>
      </HeadlessComboboxOptions>
    </HeadlessCombobox>
    <!--<TextField :label="label">
      <template #trailing>
        <BaseButton class="mr-0.75" spread="compact" variant="secondary">
          <div class="i-material-symbols:edit h-6 w-6 scale-[0.75]" />
        </BaseButton>
      </template>
    </TextField>-->
    <div v-if="value" class="box-border sm:ml-12">
      <TextField label="Amount" :name="`${name}.amount`" type="number">
        <template #trailing>
          <BaseButton class="mr-0.75" spread="compact" variant="secondary">
            <template #icon>
              <div
                class="i-material-symbols:keyboard-arrow-down-rounded scale-[1.25]"
              />
            </template>
            ks
          </BaseButton>
        </template>
      </TextField>
    </div>
  </div>
</template>
