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
  await props.onSubmit?.(values, opts as any);
});
</script>

<template>
  <form
    class="w-full flex flex-col gap-8"
    @reset="handleReset"
    @submit="submit"
  >
    <div class="flex flex-col items-center gap-4 lg:flex-row">
      <h1 class="my-0 grow text-center text-5xl lg:text-left">New recipe</h1>
      <BaseButton variant="secondary">Save as draft</BaseButton>
      <BaseButton type="submit">Publish</BaseButton>
    </div>
    <div class="items-strech w-full flex flex-col gap-4">
      <div class="flex flex-col gap-4 lg:flex-row lg:gap-8">
        <RecipeImageField
          class="w-full shrink-0 lg:min-h-112 lg:min-w-80 lg:w-80"
          :class="{
            'pb-6': errors.description && !errors.image,
          }"
          name="image"
        />
        <div
          class="min-h-112 flex grow flex-col"
          :class="{
            'pb-2': errors.image && !errors.description,
          }"
        >
          <TextField label="Title" name="title" />
          <div class="flex flex-col xl:flex-row xl:gap-4">
            <TextField label="Preparation time" name="preparationDuration" />
            <TextField
              label="Nutrition"
              :min="1"
              name="nutritionPerServing"
              type="number"
            />
            <TextField
              label="Servings"
              :min="1"
              name="numberOfServings"
              type="number"
            />
          </div>
          <TextField label="Categories" name="categories" />
          <TextField
            class="shrink-0 grow"
            label="Description"
            multiline
            name="description"
          />
        </div>
      </div>
      <div class="flex flex-col gap-8 xl:flex-row">
        <IngredientFieldArray class="grow-1 basis-0" />
        <StepFieldArray class="grow-2 basis-0" />
      </div>
    </div>
  </form>
</template>
