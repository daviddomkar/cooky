<script setup lang="ts">
import { UnitType } from "@prisma/client";
import type { Input, Output } from "valibot";
import type { SubmissionHandler } from "vee-validate";

const props = defineProps<{
  initialValues?: Input<typeof UnitFormSchema>;
  onSubmit?: SubmissionHandler<Output<typeof UnitFormSchema>>;
}>();

const emit = defineEmits<{
  (e: "cancel"): void;
}>();

const { handleSubmit, handleReset, isSubmitting, setValues } = useForm({
  validationSchema: toTypedSchema(UnitFormSchema),
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
    <TextField label="Title" name="title" />
    <SelectField
      label="Type"
      name="type"
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
    <TextField label="Abbreviation" name="abbreviation" />
    <div class="flex flex-row-reverse gap-2">
      <BaseButton expanded :loading="isSubmitting" type="submit">
        {{ props.initialValues?.id ? "Edit" : "Create" }}
      </BaseButton>
      <BaseButton
        class="w-full"
        :disabled="isSubmitting"
        variant="danger"
        @click="emit('cancel')"
      >
        Cancel
      </BaseButton>
    </div>
  </form>
</template>
