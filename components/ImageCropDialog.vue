<script setup lang="ts">
import { Cropper, CircleStencil, RectangleStencil } from "vue-advanced-cropper";
import { SuperImageCropper } from "super-image-cropper";

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

const model = defineModel<Blob | null>();

const src = ref<string | null>(null);
const cropperRef = ref<InstanceType<typeof Cropper>>();
const saving = ref(false);

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
    model.value = null;
  } finally {
    saving.value = false;
  }
};

const loadBlob = (blob: Blob) => {
  model.value = blob;
};

watch(
  model,
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
  <BaseDialog
    :model-value="!!model"
    :panel-class="panelClass"
    :title="title"
    @update:model-value="model = null"
  >
    <template #activator>
      <slot :load-blob="loadBlob" name="activator" />
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
        @click="model = null"
      >
        Cancel
      </BaseButton>
    </div>
  </BaseDialog>
</template>
