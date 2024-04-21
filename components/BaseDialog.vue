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

const model = defineModel<boolean>({
  default: false,
});

const open = () => {
  model.value = true;
};

const handleClose = () => {
  if (props.dismissable) {
    model.value = false;
  }
};
</script>

<template>
  <slot name="activator" :open="open" />
  <HeadlessDialog class="relative z-30" :open="model" @close="handleClose">
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
</template>
