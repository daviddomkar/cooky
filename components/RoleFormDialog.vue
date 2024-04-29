<script setup lang="ts">
import type { Input, Output } from "valibot";
import type { SubmissionHandler } from "vee-validate";

const props = defineProps<{
  onSubmit?: SubmissionHandler<Output<typeof RoleFormSchema>>;
}>();

const model = defineModel<Input<typeof RoleFormSchema> | undefined>({
  default: undefined,
});

const open = (list: Input<typeof RoleFormSchema>) => {
  model.value = list;
};

const onSubmit = async (values: Output<typeof RoleFormSchema>, opts: any) => {
  await props.onSubmit?.(values, opts);
  model.value = undefined;
};
</script>

<template>
  <BaseDialog
    :model-value="!!model"
    :title="model?.id ? `Edit ${model.title} role` : 'Create new role'"
    @update:model-value="model = undefined"
  >
    <template #activator>
      <slot name="activator" :open="open" />
    </template>
    <RoleForm
      :initial-values="model"
      :on-submit="onSubmit"
      @cancel="model = undefined"
    />
  </BaseDialog>
</template>
