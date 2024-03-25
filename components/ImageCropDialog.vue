<script setup lang="ts">
import { Cropper, CircleStencil, RectangleStencil } from "vue-advanced-cropper";
import { SuperImageCropper } from "super-image-cropper";
import { useNotification } from "@kyvg/vue3-notification";
import { parse, blob, mimeType, maxSize, ValiError } from "valibot";

type Props = {
  title: string;
  stencilSize?: { width: number; height: number };
  stencilType?: "circle" | "rectangle";
  panelClass?: string;
  onSave: (blob: Blob) => Promise<void>;
};

const props = withDefaults(defineProps<Props>(), {
  stencilSize: () => {
    return { width: 256, height: 256 };
  },
  stencilType: "rectangle",
  panelClass: undefined,
});

const model = defineModel<boolean>({
  default: false,
});

onUnmounted(() => {
  // Revoke the object URL, to allow the garbage collector to destroy the uploaded file
  if (src.value) {
    URL.revokeObjectURL(src.value);
  }
});

const ImageFileSchema = blob("Invalid file.", [
  mimeType(
    ["image/jpeg", "image/png", "image/gif"],
    "The file must be an image (jpeg, png or gif).",
  ),
  maxSize(10 * 1024 * 1024, "The file size must be less than 10MB."),
]);

const { notify } = useNotification();

const src = ref<string | null>(null);
const cropperRef = ref<InstanceType<typeof Cropper>>();
const saving = ref(false);

const handleChangeWithOpen = (open: () => void) => {
  return (payload: Event) => {
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

    try {
      const blob = parse(ImageFileSchema, target.files[0]);

      // Revoke the object URL, to allow the garbage collector to destroy the uploaded file
      if (src.value) {
        URL.revokeObjectURL(src.value);
      }

      src.value = URL.createObjectURL(blob);
    } catch (error) {
      if (error instanceof ValiError) {
        notify({
          type: "error",
          title: "Invalid file",
          text: error.message,
        });
      } else {
        notify({
          type: "error",
          title: "An error occurred",
          text: "An error occurred while processing the file.",
        });
      }
      return;
    } finally {
      // Reset the input value so it can be used again
      target.value = "";
    }

    open();
  };
};

const saveImage = async () => {
  if (saving.value) {
    return;
  }

  saving.value = true;

  if (!cropperRef.value) {
    saving.value = false;
    return;
  }

  const {
    coordinates,
    image: { transforms },
  } = cropperRef.value.getResult();

  const cropper = new SuperImageCropper();

  const blob = await cropper.crop({
    src: src.value ?? undefined,
    cropperJsOpts: {
      x: coordinates.left * -1,
      y: coordinates.top * -1,
      width: coordinates.width,
      height: coordinates.height,
      rotate: transforms.rotate,
      scaleX: transforms.flip.horizontal ? -1 : 1,
      scaleY: transforms.flip.vertical ? -1 : 1,
    },
    outputType: "blob",
  });

  if (!blob) {
    saving.value = false;
    return;
  }

  try {
    await props.onSave(blob as Blob);
    model.value = false;
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <BaseDialog v-model="model" :panel-class="panelClass" :title="title">
    <template #activator="{ open }">
      <slot :handle-change="handleChangeWithOpen(open)" name="activator" />
    </template>
    <div
      class="w-full overflow-hidden rounded-[1.25rem] bg-black"
      :style="{
        aspectRatio: `${stencilSize.width} / ${stencilSize.height}`,
      }"
    >
      <Cropper
        ref="cropperRef"
        class="h-full w-full"
        image-restriction="stencil"
        :move-image="!saving"
        :src="src"
        :stencil-component="
          stencilType === 'rectangle' ? RectangleStencil : CircleStencil
        "
        :stencil-props="{
          handlers: {},
          lines: {},
          aspectRatio: stencilSize.width / stencilSize.height,
          movable: false,
          resizable: false,
        }"
        :stencil-size="
          ({ boundaries }: any) => {
            return {
              width: boundaries.width * 0.8,
              height: boundaries.height * 0.8,
            };
          }
        "
      />
    </div>
    <div class="flex flex-row-reverse gap-2">
      <BaseButton class="w-full" :loading="saving" @click="saveImage">
        Save
      </BaseButton>
      <BaseButton
        class="w-full"
        :disabled="saving"
        variant="danger"
        @click="model = false"
      >
        Cancel
      </BaseButton>
    </div>
  </BaseDialog>
</template>
