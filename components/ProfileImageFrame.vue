<script setup lang="ts">
type Props = {
  username: string;
  profileImageId?: string | null;
  editable?: boolean;
  diameter?: number;
  onNewProfileImage: (blob: Blob) => Promise<void>;
};

withDefaults(defineProps<Props>(), {
  profileImageId: undefined,
  editable: false,
  diameter: 192,
});
</script>

<template>
  <PictureFrame
    :diameter="diameter"
    :src="
      profileImageId
        ? `/api/files/${profileImageId}`
        : `https://api.dicebear.com/8.x/micah/svg?seed=${username}&backgroundType=solid,gradientLinear&backgroundColor=b6e3f4,c0aede,d1d4f9,ffdfbf,ffd5dc`
    "
  >
    <ImageCropDialog
      v-if="editable"
      :on-save="onNewProfileImage"
      :stencil-size="{ width: 384, height: 384 }"
      stencil-type="circle"
      title="Change profile picture"
    >
      <template #activator="{ handleChange }">
        <label
          class="block h-full w-full flex cursor-pointer items-center justify-center border-none bg-black/40 opacity-0 transition-opacity hover:opacity-100"
        >
          <div class="i-material-symbols:edit text-4xl" />
          <input accept="image/*" hidden type="file" @change="handleChange" />
        </label>
      </template>
    </ImageCropDialog>
  </PictureFrame>
</template>
