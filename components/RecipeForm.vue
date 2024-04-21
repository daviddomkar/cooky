<script setup lang="ts">
import type { UnitType } from "@prisma/client";
import type { Input, Output } from "valibot";
import type { SubmissionHandler } from "vee-validate";

const props = defineProps<{
  categories: { id: string; title: string }[];
  units: { id: string; title: string; abbreviation: string; type: UnitType }[];
  initialValues?: Input<typeof RecipeFormSchema>;
  initialRecipeImageSrc?: string;
  initialRecipeBlob?: Blob;
  onSubmit?: SubmissionHandler<Output<typeof RecipeFormSchema>>;
}>();

const categoryOptions = computed(() => {
  return props.categories.map((category) => ({
    key: category.id,
    title: category.title,
    value: category.id,
  }));
});

const { handleSubmit, handleReset, errors, isSubmitting, setFieldValue } =
  useForm({
    validationSchema: toTypedSchema(RecipeFormSchema),
    initialValues: props.initialValues,
  });

const submit = handleSubmit(async (values, opts) => {
  await props.onSubmit?.(values, opts as any);
});

const publish = async () => {
  setFieldValue("draft", false);
  await submit();
};

const saveAsDraft = async () => {
  setFieldValue("draft", true);
  await submit();
};
</script>

<template>
  <form
    class="w-full flex flex-col gap-8"
    @reset="handleReset"
    @submit="submit"
  >
    <div class="flex flex-col items-center gap-4 lg:flex-row">
      <h1 class="my-0 grow text-center text-5xl lg:text-left">
        {{ initialValues?.title ? `Edit ${initialValues?.title}` : "New" }}
        recipe
      </h1>
      <BaseButton
        v-if="initialValues?.draft"
        :loading="isSubmitting"
        type="submit"
        variant="secondary"
        @click.prevent="saveAsDraft"
      >
        Save as draft
      </BaseButton>
      <BaseButton
        :loading="isSubmitting"
        type="submit"
        @click.prevent="publish"
      >
        Publish
      </BaseButton>
    </div>
    <div class="items-strech w-full flex flex-col gap-4">
      <div class="flex flex-col gap-4 lg:flex-row lg:gap-8">
        <RecipeImageField
          class="w-full shrink-0 lg:min-h-112 lg:min-w-80 lg:w-80"
          :class="{
            'pb-6': errors.description && !errors.image,
          }"
          :initial-blob="initialRecipeBlob"
          :initial-src="initialRecipeImageSrc"
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
          <SelectField
            label="Categories"
            multiple
            name="categories"
            :options="categoryOptions"
          />
          <TextField
            class="shrink-0 grow"
            label="Description"
            multiline
            name="description"
          />
        </div>
      </div>
      <div class="flex flex-col gap-8 xl:flex-row">
        <RecipeIngredientFieldArray class="grow-1 basis-0" :units="units" />
        <StepFieldArray class="grow-2 basis-0" />
      </div>
    </div>
  </form>
</template>
