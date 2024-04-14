<script setup lang="ts">
import type { Input } from "valibot";
import BaseButton from "./BaseButton.vue";
import TextField from "./TextField.vue";

type Props = {
  name: string;
  label: string;
};

const props = defineProps<Props>();

const {
  value,
  handleChange: handleFieldChange,
  errorMessage,
  meta,
  validate,
} = useField<Input<typeof IngredientFormSchema>>(
  () => `${props.name}.ingredient`,
);

const query = ref("");

const dialogRef = ref<Input<typeof IngredientFormSchema> | undefined>();

const ingredientsContainerRef = ref<HTMLElement | null>(null);

const { data: ingredients } = await useInfiniteScrollFetch(
  ingredientsContainerRef,
  "/api/ingredients",
  {
    take: 10,
    query: {
      query,
    },
  },
);

const handleChange = (ingredient: Input<typeof IngredientFormSchema>) => {
  /* if (queryIngredient.value !== null && ingredient === queryIngredient.value) {
    dialogRef.value = ingredient;
    return;
  } */

  console.log(ingredient);

  if (ingredient) {
    query.value = ingredient.title;
  }

  handleFieldChange(ingredient, query.value !== "");
};

const handleQueryUpdate = (q: string) => {
  query.value = q;
};

const handleQueryBlur = () => {
  if (query.value === "") {
    validate();
  }
};
</script>

<template>
  <div>
    <IngredientFormDialog v-model="dialogRef" />
    <HeadlessCombobox
      as="div"
      class="relative focus:outline-none"
      :model-value="value"
      :name="`${props.name}.ingredient`"
      nullable
      @update:model-value="handleChange"
    >
      <HeadlessComboboxInput as="template" class="focus:outline-none">
        <TextField
          :controlled="false"
          :error="!!errorMessage"
          :label="label"
          :model-value="query"
          :name="`${name}.query`"
          @blur="handleQueryBlur"
          @update:model-value="handleQueryUpdate"
        >
          <template v-if="value && meta.dirty && meta.valid" #trailing>
            <BaseButton class="mr-0.75" spread="compact" variant="secondary">
              <div class="i-material-symbols:edit h-6 w-6 scale-[0.75]" />
            </BaseButton>
          </template>
          <template #error>
            <label
              v-if="errorMessage"
              class="inline-block px-6 pb-1 text-xs text-error"
            >
              {{ errorMessage }}
            </label>
          </template>
        </TextField>
      </HeadlessComboboxInput>

      <HeadlessComboboxOptions as="template">
        <ul
          ref="ingredientsContainerRef"
          class="absolute z-1 my-0 max-h-80 w-full list-none overflow-auto rounded-3xl bg-surface pl-0 text-on-surface shadow-2xl -mt-3 dark:bg-surface-container"
          :class="{
            '-mt-5': !!errorMessage,
          }"
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
            v-if="query"
            class="cursor-pointer from-primary to-secondary bg-gradient-to-r px-6 py-3 text-base text-white"
            :value="null"
            @click="dialogRef = { title: query, unitTypes: [] }"
          >
            Create "{{ query.trim() }}"
          </HeadlessComboboxOption>
        </ul>
      </HeadlessComboboxOptions>
    </HeadlessCombobox>
    <div v-if="value && meta.dirty && meta.valid" class="box-border sm:ml-12">
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
