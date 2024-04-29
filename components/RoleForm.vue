<script setup lang="ts">
import type { Input, Output } from "valibot";
import type { SubmissionHandler } from "vee-validate";

const props = defineProps<{
  initialValues?: Input<typeof RoleFormSchema>;
  onSubmit?: SubmissionHandler<Output<typeof RoleFormSchema>>;
}>();

const emit = defineEmits<{
  (e: "cancel"): void;
}>();

const { handleSubmit, handleReset, isSubmitting, setValues } = useForm({
  validationSchema: toTypedSchema(RoleFormSchema),
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
      label="Permissions"
      multiple
      name="permissions"
      :options="
        Object.values(permissions).map((value) => {
          return {
            key: value,
            title: value,
            value,
          };
        })
      "
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
