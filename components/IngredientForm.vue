<script setup lang="ts">
import type { Input, Output } from "valibot";
import type { SubmissionHandler } from "vee-validate";

const props = defineProps<{
  initialValues?: Input<typeof IngredientFormSchema>;
  onSubmit?: SubmissionHandler<Output<typeof IngredientFormSchema>>;
}>();

const { handleSubmit, handleReset } = useForm({
  validationSchema: toTypedSchema(IngredientFormSchema),
  initialValues: props.initialValues,
});

const submit = handleSubmit(async (values, opts) => {
  await props.onSubmit?.(values, opts as any);
});
</script>

<template>
  <form class="w-full flex flex-col" @reset="handleReset" @submit="submit">
    <TextField label="Title" name="title" />
    <TextField label="Unit Types" name="unitTypes" />
    <BaseButton expanded type="submit">Create</BaseButton>
  </form>
</template>
