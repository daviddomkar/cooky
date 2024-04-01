<script setup lang="ts">
import { useNotification } from "@kyvg/vue3-notification";
import { parse, blob, mimeType, maxSize, ValiError } from "valibot";

type Props = {
  username: string;
  profileImageId?: string | null;
  editable?: boolean;
  onNewProfileImage: (blob: Blob) => Promise<void>;
};

withDefaults(defineProps<Props>(), {
  profileImageId: undefined,
  editable: false,
});

const ImageFileSchema = blob("Invalid file.", [
  mimeType(
    ["image/jpeg", "image/png", "image/gif"],
    "The file must be an image (jpeg, png or gif).",
  ),
  maxSize(10 * 1024 * 1024, "The file size must be less than 10MB."),
]);

const { notify } = useNotification();

const blobRef = ref<Blob | null>(null);

const handleChange = (payload: Event) => {
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
    blobRef.value = blob;
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
};
</script>

<template>
  <PictureFrame
    :src="getProfileImageUrl(username, profileImageId)"
  >
    <ImageCropDialog
      v-if="editable"
      v-model="blobRef"
      :on-save="onNewProfileImage"
      :stencil-size="{ width: 384, height: 384 }"
      stencil-type="circle"
      title="Change profile picture"
    >
      <template #activator>
        <label
          class="block h-full w-full flex cursor-pointer items-center justify-center border-none bg-black/40 opacity-0 transition-opacity hover:opacity-100"
        >
          <div class="i-material-symbols:edit text-4xl text-white" />
          <input accept="image/*" hidden type="file" @change="handleChange" />
        </label>
      </template>
    </ImageCropDialog>
  </PictureFrame>
</template>
