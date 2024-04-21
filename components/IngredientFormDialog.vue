<script setup lang="ts">
import type { UnitType } from "@prisma/client";
import type { Input, Output } from "valibot";
import type { SubmissionHandler } from "vee-validate";

const props = defineProps<{
  disabledUnitTypes?: UnitType[];
  onSubmit?: SubmissionHandler<Output<typeof IngredientFormSchema>>;
}>();

const model = defineModel<Input<typeof IngredientFormSchema> | undefined>();

const open = (ingredient: Input<typeof IngredientFormSchema>) => {
  model.value = ingredient;
};

const onSubmit = async (
  values: Output<typeof IngredientFormSchema>,
  opts: any,
) => {
  await props.onSubmit?.(values, opts);
  model.value = undefined;
};
</script>

<template>
  <BaseDialog
    :model-value="!!model"
    :title="
      model?.unitTypes?.length
        ? `Edit ${model?.title ?? ''} ingredient`
        : `Create ${model?.title ?? ''} ingredient`
    "
    @update:model-value="model = undefined"
  >
    <template #activator>
      <slot name="activator" :open="open" />
    </template>
    <IngredientForm
      :disabled-unit-types="disabledUnitTypes"
      :initial-values="model"
      :on-submit="onSubmit"
    />
  </BaseDialog>
</template>
