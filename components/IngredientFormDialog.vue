<script setup lang="ts">
import type { Input } from "valibot";

const model = defineModel<Input<typeof IngredientFormSchema> | undefined>();

const open = (ingredient: Input<typeof IngredientFormSchema>) => {
  model.value = ingredient;
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
    <IngredientForm :initial-values="model" />
  </BaseDialog>
</template>
