<script setup lang="ts">
import { Visibility } from "@prisma/client";
import type { Input, Output } from "valibot";
import type { SubmissionHandler } from "vee-validate";

const props = defineProps<{
  initialValues?: Input<typeof ListFormSchema>;
  onSubmit?: SubmissionHandler<Output<typeof ListFormSchema>>;
}>();

const emit = defineEmits<{
  (e: "cancel"): void;
}>();

const { handleSubmit, handleReset, isSubmitting, setValues } = useForm({
  validationSchema: toTypedSchema(ListFormSchema),
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
      label="Visibility"
      name="visibility"
      :options="[
        {
          key: 'private',
          title: 'Private',
          value: Visibility.PRIVATE,
        },
        {
          key: 'public',
          title: 'Public',
          value: Visibility.PUBLIC,
        },
      ]"
    />
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
