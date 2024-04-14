<script setup lang="ts">
import type { Input, Output } from "valibot";
import type { UnitType } from "@prisma/client";
import BaseButton from "./BaseButton.vue";
import TextField from "./TextField.vue";

type Props = {
  units: { id: string; title: string; abbreviation: string; type: UnitType }[];
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
const unitId = ref<string | undefined>();

// Used for storing current existing ingredient based on which the unit types are disabled
const originalValue = ref<Input<typeof IngredientFormSchema> | undefined>();

// Used for storing the ingredient that is being created
const queryIngredient = computed(() => {
  return { id: undefined, title: query.value, unitTypes: [] };
});

const unitOptions = computed(() => {
  return props.units
    .filter((unit) =>
      value?.value.unitTypes?.some((type) => unit.type === type),
    )
    .map((unit) => ({
      key: unit.id,
      title: `${unit.title} (${unit.abbreviation})`,
      value: unit.id,
    }));
});

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

const handleIngredientSubmit = (
  ingredient: Output<typeof IngredientFormSchema>,
) => {
  if (ingredient.id) {
    handleFieldChange({
      ...ingredient,
      title: query.value,
    });
  } else {
    handleFieldChange(ingredient);
  }
};

const handleChange = (ingredient: Input<typeof IngredientFormSchema>) => {
  if (ingredient?.id === undefined && ingredient?.title === query.value) {
    originalValue.value = undefined;
    dialogRef.value = ingredient;
    return;
  }

  if (ingredient) {
    originalValue.value = ingredient;
    query.value = ingredient.title;
  }

  handleFieldChange(ingredient, query.value !== "");
};

const handleQueryUpdate = (q: string | number) => {
  query.value = q as string;
};

const handleQueryBlur = () => {
  if (query.value === "") {
    validate();
  }
};

watch(dialogRef, (opened) => {
  if (!opened) {
    validate();
    if (value?.value?.title) {
      query.value = value.value.title;
    }
  }
});

watch(unitOptions, (options) => {
  if (!options.some((option) => option.value === unitId.value)) {
    unitId.value = undefined;
  }
});
</script>

<template>
  <div>
    <IngredientFormDialog
      v-model="dialogRef"
      :disabled-unit-types="originalValue?.unitTypes"
      :on-submit="handleIngredientSubmit"
    />
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
          :error-message="errorMessage"
          :label="label"
          :model-value="query"
          :name="`${name}.query`"
          @blur="handleQueryBlur"
          @update:model-value="handleQueryUpdate"
        >
          <template v-if="value && meta.dirty && meta.valid" #trailing>
            <BaseButton
              v-if="value && meta.dirty && meta.valid"
              spread="compact"
              variant="secondary"
              @click="dialogRef = value"
            >
              <div class="i-material-symbols:edit h-6 w-6 scale-[0.75]" />
            </BaseButton>
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
            v-slot="{ selected, active }"
            as="template"
            :value="ingredient"
          >
            <li
              class="flex cursor-pointer px-6 py-3 text-base"
              :class="{
                'border-b-1 border-b-outline/50 border-b-solid':
                  index !== ingredients.length - 1,
                'bg-outline/20': active,
                'text-primary': selected,
              }"
            >
              <div class="grow">
                {{ ingredient.title }}
              </div>
              <div
                class="i-material-symbols:check-small-rounded h-6 w-6 scale-[1.25]"
                :class="{
                  invisible: !selected,
                }"
              />
            </li>
          </HeadlessComboboxOption>
          <HeadlessComboboxOption
            v-if="query"
            class="cursor-pointer from-primary to-secondary bg-gradient-to-r px-6 py-3 text-base text-white"
            :value="queryIngredient"
          >
            Create "{{ query.trim() }}"
          </HeadlessComboboxOption>
        </ul>
      </HeadlessComboboxOptions>
    </HeadlessCombobox>
    <div v-if="value && meta.dirty && meta.valid" class="box-border sm:ml-12">
      <TextField label="Amount" :name="`${name}.amount`" type="number" />
      <SelectField
        v-model="unitId"
        label="Unit"
        :name="`${name}.unitId`"
        :options="unitOptions"
      />
    </div>
  </div>
</template>
