<script setup lang="ts">
import type { Input, Output } from "valibot";
import type { SubmissionHandler } from "vee-validate";

const props = defineProps<{
  initialValues?: Input<typeof CategoryFormSchema>;
  onSubmit?: SubmissionHandler<Output<typeof CategoryFormSchema>>;
}>();

const emit = defineEmits<{
  (e: "cancel"): void;
}>();

const { handleSubmit, handleReset, isSubmitting, setValues } = useForm({
  validationSchema: toTypedSchema(CategoryFormSchema),
  initialValues: props.initialValues,
});

const submit = handleSubmit(async (values, opts) => {
  await props.onSubmit?.(values, opts as any);
});

const categoryIconNames = [
  "breakfast",
  "lunch",
  "dinner",
  "snacks",
  "soups",
  "sauces",
  "recipes",
  "ingredients",
];

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
    <TextField label="Slug" name="slug" />
    <SelectField
      label="Icon"
      name="icon"
      :options="
        categoryIconNames.map((name) => {
          return {
            key: name,
            title: name,
            value: name,
          };
        })
      "
    />
    <TextField label="Order" :min="0" name="order" type="number" />
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
