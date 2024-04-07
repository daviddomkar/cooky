<script setup lang="ts">
import type { Output } from "valibot";
import { useSortable } from "@vueuse/integrations/useSortable";

const {
  push: addStep,
  remove: removeStep,
  fields: steps,
  move: moveStep,
} = useFieldArray<Output<typeof StepSchema>>("steps");

useSortable("#steps", steps, {
  handle: ".cursor-grab",
  animation: 300,
  onUpdate: (e: { oldIndex: number; newIndex: number }) => {
    moveStep(e.oldIndex, e.newIndex);
  },
});
</script>

<template>
  <div class="flex flex-col">
    <h2 class="my-0 mb-4 text-3xl text-on-surface-variant">Steps</h2>
    <div id="steps">
      <div v-for="(step, idx) in steps" :key="step.key" class="flex gap-2">
        <div class="h-12 flex items-center">
          <BaseButton
            class="cursor-grab"
            density="compact"
            spread="none"
            variant="transparent"
          >
            <div class="i-material-symbols:drag-indicator h-8 w-8" />
          </BaseButton>
        </div>
        <div class="grow basis-0 items-stretch">
          <TextField :label="`${idx + 1}. Step`" :name="`steps.${idx}.title`" />
          <div class="box-border sm:pl-12">
            <TextField
              class="h-32"
              label="Content"
              multiline
              :name="`steps.${idx}.content`"
            />
          </div>
        </div>
        <div class="h-12 flex items-center">
          <BaseButton
            class="z-1"
            spread="compact"
            variant="danger"
            @click="removeStep(idx)"
          >
            <div class="i-material-symbols:delete h-6 w-6" />
          </BaseButton>
        </div>
      </div>
    </div>
    <BaseButton spread="compact" @click="addStep">
      <template #icon>
        <div class="i-material-symbols:add scale-[1.25]" />
      </template>
      Add Step
    </BaseButton>
  </div>
</template>
