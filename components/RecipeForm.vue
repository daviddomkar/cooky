<script setup lang="ts">
import type { Input, Output } from "valibot";
import type { SubmissionHandler } from "vee-validate";
import { useSortable } from "@vueuse/integrations/useSortable";

const props = defineProps<{
  initialValues?: Input<typeof NewRecipeSchema>;
  onSubmit?: SubmissionHandler<Output<typeof NewRecipeSchema>>;
}>();

const { handleSubmit, handleReset, errors } = useForm({
  validationSchema: toTypedSchema(NewRecipeSchema),
  initialValues: props.initialValues,
});

const submit = handleSubmit(async (values, opts) => {
  await props.onSubmit?.(values, opts as any);
});

const {
  push: addIngredient,
  remove: removeIngredient,
  fields: ingredients,
  move: moveIngredient,
} = useFieldArray<Output<typeof NewRecipeSchema>["ingredients"][number]>(
  "ingredients",
);

const {
  push: addStep,
  remove: removeStep,
  fields: steps,
  move: moveStep,
} = useFieldArray<Output<typeof NewRecipeSchema>["steps"][number]>("steps");

useSortable("#ingredients", ingredients, {
  handle: ".cursor-grab",
  animation: 300,
  onUpdate: (e: { oldIndex: number; newIndex: number }) => {
    moveIngredient(e.oldIndex, e.newIndex);
  },
});

useSortable("#steps", steps, {
  handle: ".cursor-grab",
  animation: 300,
  onUpdate: (e: { oldIndex: number; newIndex: number }) => {
    moveStep(e.oldIndex, e.newIndex);
  },
});
</script>

<template>
  <form
    class="items-strech w-full flex flex-col gap-2"
    @reset="handleReset"
    @submit="submit"
  >
    <div class="flex gap-8">
      <RecipeImageField
        :class="{
          'pb-6': errors.description && !errors.image,
        }"
        name="image"
      />
      <div
        class="box-border flex grow flex-col"
        :class="{
          'pb-2': errors.image && !errors.description,
        }"
      >
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
      <div class="flex grow-1 basis-0 flex-col">
        <h2 class="my-0 mb-4 text-3xl text-on-surface-variant">Ingredients</h2>
        <div id="ingredients">
          <div
            v-for="(ingredient, idx) in ingredients"
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
            <div class="flex grow basis-0 gap-2">
              <div class="grow basis-0">
                <div class="relative box-border">
                  <div class="absolute right-1 h-12 flex items-center gap-1">
                    <BaseButton
                      class="z-1"
                      spread="compact"
                      variant="secondary"
                    >
                      <div
                        class="i-material-symbols:edit h-6 w-6 scale-[0.75]"
                      />
                    </BaseButton>
                  </div>
                  <TextField
                    :label="`${idx + 1}. Ingredient`"
                    :name="`ingredients[${idx}].id`"
                  />
                </div>
                <div class="relative box-border pl-12">
                  <div class="absolute right-1 h-12 flex items-center">
                    <BaseButton
                      class="z-1"
                      spread="compact"
                      variant="secondary"
                    >
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
                    :name="`ingredients[${idx}].amount`"
                    type="number"
                  />
                </div>
              </div>
              <div class="h-12 flex items-center">
                <BaseButton
                  class="z-1"
                  spread="compact"
                  variant="danger"
                  @click="removeIngredient(idx)"
                >
                  <div class="i-material-symbols:delete h-6 w-6" />
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
        <BaseButton
          spread="compact"
          @click="addIngredient({ id: '', amount: 1 })"
        >
          <template #icon>
            <div class="i-material-symbols:add scale-[1.25]" />
          </template>
          Add Ingredient
        </BaseButton>
      </div>
      <div class="flex grow-2 basis-0 flex-col">
        <h2 class="my-0 mb-4 text-3xl text-on-surface-variant">Steps</h2>
        <div id="steps">
          <div v-for="(step, idx) in steps" :key="step.key" class="flex gap-2">
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
            <div class="grow basis-0 items-stretch">
              <TextField
                :label="`${idx + 1}. Step`"
                :name="`steps[${idx}].title`"
              />
              <div class="box-border pl-12">
                <TextField
                  class="h-32"
                  :class="{
                    'h-34': (errors as any)[`steps[${idx}].content`],
                  }"
                  label="Content"
                  multiline
                  :name="`steps[${idx}].content`"
                />
              </div>
            </div>
            <div class="h-12 flex items-center">
              <BaseButton
                class="z-1"
                spread="compact"
                variant="danger"
                @click="removeStep(idx)"
              >
                <div class="i-material-symbols:delete h-6 w-6" />
              </BaseButton>
            </div>
          </div>
        </div>
        <BaseButton spread="compact" @click="addStep">
          <template #icon>
            <div class="i-material-symbols:add scale-[1.25]" />
          </template>
          Add Step
        </BaseButton>
      </div>
    </div>
  </form>
</template>
