<script setup lang="ts">
import type { Input, Output } from "valibot";
import type { SubmissionHandler } from "vee-validate";

const props = defineProps<{
  onSubmit?: SubmissionHandler<Output<typeof ListFormSchema>>;
}>();

const model = defineModel<Input<typeof ListFormSchema> | undefined>();

const open = (list: Input<typeof ListFormSchema>) => {
  model.value = list;
};

const onSubmit = async (values: Output<typeof ListFormSchema>, opts: any) => {
  await props.onSubmit?.(values, opts);
  model.value = undefined;
};
</script>

<template>
  <BaseDialog
    :model-value="!!model"
    title="Create new list"
    @update:model-value="model = undefined"
  >
    <template #activator>
      <slot name="activator" :open="open" />
    </template>
    <ListForm :initial-values="model" :on-submit="onSubmit" />
  </BaseDialog>
</template>
