<script setup lang="ts">
import type { Input, Output } from "valibot";
import type { SubmissionHandler } from "vee-validate";

const props = defineProps<{
  initialValues?: Input<typeof UserFormSchema>;
  onSubmit?: SubmissionHandler<Output<typeof UserFormSchema>>;
  roles: {
    id: string;
    title: string;
  }[];
}>();

const emit = defineEmits<{
  (e: "cancel"): void;
}>();

const { handleSubmit, handleReset, isSubmitting, setValues } = useForm({
  validationSchema: toTypedSchema(UserFormSchema),
  initialValues: props.initialValues,
});

const submit = handleSubmit(async (values, opts) => {
  await props.onSubmit?.(values, opts as any);
});

const roleOptions = computed(() =>
  props.roles.map((role) => {
    return {
      title: role.title,
      key: role.id,
      value: role.id,
    };
  }),
);

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
    <TextField label="Name" name="name" />
    <TextField label="Username" name="username" />
    <TextField label="Email" name="email" />
    <SelectField label="Roles" multiple name="roles" :options="roleOptions" />
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
