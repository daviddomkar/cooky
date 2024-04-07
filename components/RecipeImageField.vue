<script setup lang="ts">
import { useNotification } from "@kyvg/vue3-notification";

type Props = {
  name: string;
};

const props = defineProps<Props>();

const draggedOver = ref(false);

const src = ref<string | null>(null);

const { value, setValue, errorMessage } = useField<Blob>(() => props.name);

const { notify } = useNotification();

const handleDrop = (event: DragEvent) => {
  draggedOver.value = false;

  if (!event.dataTransfer?.files?.length) {
    notify({
      type: "error",
      title: "An error occurred",
      text: "No file was selected.",
    });
    return;
  }

  setValue(event.dataTransfer.files[0], true);
};

const handleChange = (payload: Event) => {
  draggedOver.value = false;

  const target = payload.target as HTMLInputElement;

  if (!target.files?.length) {
    // Reset the input value so it can be used again
    target.value = "";

    notify({
      type: "error",
      title: "An error occurred",
      text: "No file was selected.",
    });
    return;
  }

  setValue(target.files[0], true);
};

watch(
  value,
  (blob) => {
    if (src.value) {
      URL.revokeObjectURL(src.value);
    }

    if (!blob) {
      src.value = null;
      return;
    }

    src.value = URL.createObjectURL(blob);
  },
  { immediate: true },
);

onUnmounted(() => {
  if (src.value) {
    URL.revokeObjectURL(src.value);
  }
});
</script>

<template>
  <div
    class="flex shrink-0 basis-0 flex-col gap-1"
    :class="{
      'pb-4': !errorMessage,
    }"
  >
    <label
      class="relative box-border h-112 w-full flex shrink-0 flex-col cursor-pointer items-center justify-center gap-2 overflow-hidden border-2 border-outline rounded-3xl border-dashed text-outline transition-colors hover:border-primary hover:text-primary"
      :class="{
        '!h-initial !border-primary !text-primary !border-solid':
          src && value.type.startsWith('image/') && !errorMessage,
        '!border-primary !text-primary': draggedOver,
        '!border-error !text-error': errorMessage,
        '!text-outline !border-outline': value && !errorMessage,
      }"
      @dragenter.prevent="draggedOver = true"
      @dragleave.prevent="draggedOver = false"
      @dragover.prevent="draggedOver = true"
      @drop.prevent="handleDrop"
    >
      <img
        v-if="src && value.type.startsWith('image/') && !errorMessage"
        alt="Recipe Image"
        class="w-full"
        :src="src"
      />
      <input accept="image/*" hidden type="file" @change="handleChange" />
      <h4 v-if="!value || errorMessage" class="my-0 text-center text-2xl">
        Recipe cover image
      </h4>
      <div
        v-if="!value || errorMessage"
        class="text-8xl"
        :class="{
          'i-material-symbols:upload-rounded': !errorMessage || draggedOver,
          'i-material-symbols:dangerous-outline-rounded':
            errorMessage && !draggedOver,
        }"
      />
      <p v-if="!value || errorMessage" class="my-0 text-center">
        {{
          draggedOver
            ? "Release to upload"
            : "Drag file here or click to upload."
        }}
      </p>
      <div
        v-if="src && value.type.startsWith('image/') && !errorMessage"
        class="absolute left-0 top-0 h-full w-full flex flex-col cursor-pointer items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity hover:opacity-100"
        :class="{
          'opacity-100': draggedOver,
        }"
      >
        <h4 class="my-0 text-center text-2xl"> Recipe cover image </h4>
        <div class="i-material-symbols:upload-rounded text-8xl text-primary" />
        <p class="my-0 text-center">
          {{
            draggedOver
              ? "Release to upload"
              : "Drag file here or click to upload."
          }}
        </p>
      </div>
    </label>
    <label
      v-if="errorMessage && !draggedOver"
      class="inline-block px-6 pb-1 text-xs text-error"
    >
      {{ errorMessage }}
    </label>
  </div>
</template>
