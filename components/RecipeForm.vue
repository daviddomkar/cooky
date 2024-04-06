<script setup lang="ts">
import type { Input, Output } from "valibot";
import type { SubmissionHandler } from "vee-validate";

const props = defineProps<{
  initialValues?: Input<typeof NewRecipeSchema>;
  onSubmit?: SubmissionHandler<Output<typeof NewRecipeSchema>>;
}>();

const { handleSubmit, handleReset, errors } = useForm({
  validationSchema: toTypedSchema(NewRecipeSchema),
  initialValues: props.initialValues,
});

const submit = handleSubmit(async (values, opts) => {
  await props.onSubmit?.(values, opts);
});

const {
  push: addIngredient,
  remove: removeIngredient,
  fields: ingredients,
} = useFieldArray<Output<typeof NewRecipeSchema>["ingredients"][number]>(
  "ingredients",
);
</script>

<template>
  <form
    class="items-strech w-full flex flex-col gap-2"
    @reset="handleReset"
    @submit="submit"
  >
    <div class="flex gap-8">
      <div
        class="box-border shrink-0 pb-4"
        :class="{
          'pb-6': errors.description,
        }"
      >
        <div class="h-112 w-80 shrink-0 rounded-3xl bg-black" />
      </div>
      <div class="flex grow flex-col">
        <TextField label="Title" name="title" />
        <TextField label="Preparation time" name="preparationDuration" />
        <TextField label="Nutrition per serving" name="nutritionPerServing" />
        <TextField label="Number of servings" name="numberOfServings" />
        <TextField
          class="shrink-0 grow"
          label="Description"
          multiline
          name="description"
        />
      </div>
    </div>
    <div class="flex gap-8">
      <div class="flex grow-1 flex-col">
        <h2 class="my-0 mb-4 text-3xl">Ingredients</h2>
        <div
          v-for="(ingredient, index) in ingredients"
          :key="ingredient.key"
          class="flex gap-2"
        >
          <div class="h-12 flex items-center gap-2">
            <BaseButton
              class="cursor-grab"
              density="compact"
              spread="none"
              variant="transparent"
            >
              <div class="i-material-symbols:drag-indicator h-8 w-8" />
            </BaseButton>
          </div>
          <div class="flex grow gap-2">
            <div class="w-min grow">
              <div class="relative box-border">
                <div class="absolute right-1 h-12 flex items-center gap-1">
                  <BaseButton class="z-1" spread="compact" variant="secondary">
                    <div class="i-material-symbols:edit h-6 w-6 scale-[0.75]" />
                  </BaseButton>
                </div>
                <TextField
                  :label="`${index + 1}. Ingredient`"
                  :name="`ingredients[${index}].id`"
                />
              </div>
              <div class="relative box-border">
                <div class="absolute right-1 h-12 flex items-center">
                  <BaseButton class="z-1" spread="compact" variant="secondary">
                    <template #icon>
                      <div
                        class="i-material-symbols:keyboard-arrow-down-rounded scale-[1.25]"
                      />
                    </template>
                    ks
                  </BaseButton>
                </div>
                <TextField
                  label="Amount"
                  :name="`ingredients[${index}].amount`"
                />
              </div>
            </div>
            <div class="h-12 flex items-center">
              <BaseButton
                class="z-1"
                spread="compact"
                variant="danger"
                @click="removeIngredient(index)"
              >
                <div class="i-material-symbols:delete h-6 w-6" />
              </BaseButton>
            </div>
          </div>
        </div>
        <BaseButton spread="compact" @click="addIngredient">
          <template #icon>
            <div class="i-material-symbols:add scale-[1.25]" />
          </template>
          Add Ingredient
        </BaseButton>
      </div>
      <div class="flex grow-2 flex-col">
        <h2 class="my-0 mb-4 text-3xl">Steps</h2>
        <div class="flex gap-2">
          <div class="h-12 flex items-center">
            <BaseButton
              class="cursor-grab"
              density="compact"
              spread="none"
              variant="transparent"
            >
              <div class="i-material-symbols:drag-indicator h-8 w-8" />
            </BaseButton>
          </div>
          <TextField class="h-20 grow" label="1. Step" multiline name="step1" />
          <div class="h-12 flex items-center">
            <BaseButton class="z-1" spread="compact" variant="danger">
              <div class="i-material-symbols:delete h-6 w-6" />
            </BaseButton>
          </div>
        </div>
        <BaseButton spread="compact">
          <template #icon>
            <div class="i-material-symbols:add scale-[1.25]" />
          </template>
          Add Step
        </BaseButton>
      </div>
    </div>
  </form>
</template>
