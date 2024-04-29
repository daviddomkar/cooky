<script setup lang="ts">
import type { Input, Output } from "valibot";
import type { SubmissionHandler } from "vee-validate";

const props = defineProps<{
  onSubmit?: SubmissionHandler<Output<typeof CategoryFormSchema>>;
}>();

const model = defineModel<Input<typeof CategoryFormSchema> | undefined>({
  default: undefined,
});

const open = (list: Input<typeof CategoryFormSchema>) => {
  model.value = list;
};

const onSubmit = async (
  values: Output<typeof CategoryFormSchema>,
  opts: any,
) => {
  await props.onSubmit?.(values, opts);
  model.value = undefined;
};
</script>

<template>
  <BaseDialog
    :model-value="!!model"
    :title="model?.id ? `Edit ${model.title} category` : 'Create new category'"
    @update:model-value="model = undefined"
  >
    <template #activator>
      <slot name="activator" :open="open" />
    </template>
    <CategoryForm
      :initial-values="model"
      :on-submit="onSubmit"
      @cancel="model = undefined"
    />
  </BaseDialog>
</template>
