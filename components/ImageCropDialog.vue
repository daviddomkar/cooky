<script setup lang="ts">
import { Cropper, CircleStencil } from "vue-advanced-cropper";

type Props = {
  title: string;
};

defineProps<Props>();

const model = defineModel<boolean>({
  default: false,
});

const src = ref<string | null>(null);

const handleChange = (payload: Event) => {
  const target = payload.target as HTMLInputElement;

  if (!target.files?.length) {
    return;
  }

  // Revoke the object URL, to allow the garbage collector to destroy the uploaded file
  if (src.value) {
    URL.revokeObjectURL(src.value);
  }

  src.value = URL.createObjectURL(target.files[0]);

  // Reset the input value so it can be used again
  target.value = "";

  console.log(payload);
};

const forwardOpen = (open: () => void) => {
  return (payload: Event) => {
    handleChange(payload);
    open();
  };
};

onUnmounted(() => {
  // Revoke the object URL, to allow the garbage collector to destroy the uploaded file
  if (src.value) {
    URL.revokeObjectURL(src.value);
  }
});
</script>

<template>
  <BaseDialog v-model="model" :title="title">
    <template #activator="{ open }">
      <slot :handle-change="forwardOpen(open)" name="activator" />
    </template>
    <Cropper
      v-if="src"
      :src="src"
      :stencil-component="CircleStencil"
      :stencil-props="{
        aspectRatio: 1,
      }"
    />
  </BaseDialog>
</template>
