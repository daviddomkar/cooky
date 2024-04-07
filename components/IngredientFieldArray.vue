<script setup lang="ts">
import type { Output } from "valibot";
import { useSortable } from "@vueuse/integrations/useSortable";

const {
  push: addIngredient,
  remove: removeIngredient,
  fields: ingredients,
  move: moveIngredient,
} = useFieldArray<Output<typeof IngredientSchema>>("ingredients");

useSortable("#ingredients", ingredients, {
  handle: ".cursor-grab",
  animation: 300,
  onUpdate: (e: { oldIndex: number; newIndex: number }) => {
    moveIngredient(e.oldIndex, e.newIndex);
  },
});
</script>

<template>
  <div class="flex flex-col">
    <h2 class="my-0 mb-4 text-3xl text-on-surface-variant">Ingredients</h2>
    <div id="ingredients">
      <div
        v-for="(ingredient, idx) in ingredients"
        :key="ingredient.key"
        class="flex gap-2"
      >
        <div class="h-12 flex items-center gap-2">
          <BaseButton
            class="cursor-grab"
            density="compact"
            spread="none"
            variant="transparent"
          >
            <div class="i-material-symbols:drag-indicator h-8 w-8" />
          </BaseButton>
        </div>
        <div class="flex grow basis-0 gap-2">
          <div class="grow basis-0">
            <TextField
              :label="`${idx + 1}. Ingredient`"
              :name="`ingredients.${idx}.id`"
            >
              <template #trailing>
                <BaseButton
                  class="mr-0.75"
                  spread="compact"
                  variant="secondary"
                >
                  <div class="i-material-symbols:edit h-6 w-6 scale-[0.75]" />
                </BaseButton>
              </template>
            </TextField>
            <div class="box-border sm:ml-12">
              <TextField
                label="Amount"
                :name="`ingredients.${idx}.amount`"
                type="number"
              >
                <template #trailing>
                  <BaseButton
                    class="mr-0.75"
                    spread="compact"
                    variant="secondary"
                  >
                    <template #icon>
                      <div
                        class="i-material-symbols:keyboard-arrow-down-rounded scale-[1.25]"
                      />
                    </template>
                    ks
                  </BaseButton>
                </template>
              </TextField>
            </div>
          </div>
          <div class="h-12 flex items-center">
            <BaseButton
              class="z-1"
              spread="compact"
              variant="danger"
              @click="removeIngredient(idx)"
            >
              <div class="i-material-symbols:delete h-6 w-6" />
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
    <BaseButton spread="compact" @click="addIngredient({ id: '', amount: 1 })">
      <template #icon>
        <div class="i-material-symbols:add scale-[1.25]" />
      </template>
      Add Ingredient
    </BaseButton>
  </div>
</template>
