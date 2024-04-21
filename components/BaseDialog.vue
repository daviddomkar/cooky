<script setup lang="ts">
type Props = {
  title: string;
  description?: string;
  dismissable?: boolean;
  panelClass?: string;
};

const props = withDefaults(defineProps<Props>(), {
  description: undefined,
  dismissable: true,
  panelClass: undefined,
});

const model = defineModel<boolean>();

const handleClose = () => {
  if (props.dismissable) {
    model.value = false;
  }
};

const open = () => {
  model.value = true;
};
</script>

<template>
  <slot name="activator" :open="open" />
  <HeadlessTransitionRoot
    as="template"
    enter="duration-0 ease-out"
    enter-from="opacity-0"
    enter-to="opacity-100"
    leave="duration-0 ease-in"
    leave-from="opacity-100"
    leave-to="opacity-0"
    :show="model"
  >
    <HeadlessDialog class="relative z-30" @close="handleClose">
      <div
        aria-hidden="true"
        class="fixed inset-0 bg-black/40 backdrop-blur-xl"
      />

      <div
        class="fixed inset-0 box-border w-screen flex items-center justify-center p-4"
      >
        <HeadlessDialogPanel
          class="box-border max-w-md w-full flex flex-col gap-4 rounded-[1.75rem] bg-surface p-4"
          :class="panelClass"
        >
          <HeadlessDialogTitle
            class="my-0 text-center text-3xl uppercase sm:text-4xl"
          >
            {{ title }}
          </HeadlessDialogTitle>
          <HeadlessDialogDescription v-if="description">
            {{ description }}
          </HeadlessDialogDescription>
          <slot />
        </HeadlessDialogPanel>
      </div>
    </HeadlessDialog>
  </HeadlessTransitionRoot>
</template>
