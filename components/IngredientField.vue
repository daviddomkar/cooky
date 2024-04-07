<script setup lang="ts">
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

const { value, handleChange } = useField<Ingredient>(
  () => `${props.name}.ingredient`,
);

const query = ref("");

const queryIngredient = computed(() => {
  return query.value === ""
    ? null
    : { id: null, title: query.value, unitTypes: [] };
});

// const idk = ref<HTMLElement | null>(null);
/*
const { data: ingredients } = useInfiniteScrollFetch<Ingredient>(
  "/api/ingredients",
  idk,
); */

const ingredients = ref<Ingredient[]>([
  {
    id: "1",
    title: "Flour",
    unitTypes: ["g", "kg"],
  },
  {
    id: "2",
    title: "Sugar",
    unitTypes: ["g", "kg"],
  },
  {
    id: "3",
    title: "Salt",
    unitTypes: ["g", "kg"],
  },
  {
    id: "4",
    title: "Water",
    unitTypes: ["ml", "l"],
  },
]);
</script>

<template>
  <div>
    <HeadlessCombobox
      as="div"
      immediate
      :model-value="value"
      nullable
      @update:model-value="handleChange"
    >
      <HeadlessComboboxInput
        :display-value="(ingredient) => (ingredient as any).title ?? ''"
        @change="query = $event.target.value"
      />
      <HeadlessComboboxOptions>
        <HeadlessComboboxOption v-if="queryIngredient" :value="queryIngredient">
          Create "{{ query }}"
        </HeadlessComboboxOption>
        <HeadlessComboboxOption
          v-for="ingredient in ingredients"
          :key="ingredient.id"
          :value="ingredient"
        >
          {{ ingredient.title }}
        </HeadlessComboboxOption>
      </HeadlessComboboxOptions>
    </HeadlessCombobox>
    <!--<TextField :label="label">
      <template #trailing>
        <BaseButton class="mr-0.75" spread="compact" variant="secondary">
          <div class="i-material-symbols:edit h-6 w-6 scale-[0.75]" />
        </BaseButton>
      </template>
    </TextField>-->
    <div class="box-border sm:ml-12">
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
