<script setup lang="ts">
import { UnitType } from "@prisma/client";
import type { Input, Output } from "valibot";
import type { SubmissionHandler } from "vee-validate";

const props = defineProps<{
  initialValues?: Input<typeof IngredientFormSchema>;
  onSubmit?: SubmissionHandler<Output<typeof IngredientFormSchema>>;
}>();

const { handleSubmit, handleReset, setValues } = useForm({
  validationSchema: toTypedSchema(IngredientFormSchema),
  initialValues: props.initialValues,
});

const submit = handleSubmit(async (values, opts) => {
  await props.onSubmit?.(values, opts as any);
});

onMounted(() =>
  setValues(
    {
      ...props.initialValues,
    },
    false,
  ),
);
</script>

<template>
  <form class="w-full flex flex-col" @reset="handleReset" @submit="submit">
    <TextField :disabled="!!initialValues?.id" label="Title" name="title" />
    <SelectField
      label="Unit Types"
      multiple
      name="unitTypes"
      :options="[
        {
          key: 'quantity',
          title: 'Quantity',
          value: UnitType.QUANTITY,
        },
        {
          key: 'volume',
          title: 'Volume',
          value: UnitType.VOLUME,
        },
        {
          key: 'weight',
          title: 'Weight',
          value: UnitType.WEIGHT,
        },
      ]"
    />
    <BaseButton expanded type="submit">{{
      initialValues?.unitTypes?.length ? "Edit" : "Create"
    }}</BaseButton>
  </form>
</template>
