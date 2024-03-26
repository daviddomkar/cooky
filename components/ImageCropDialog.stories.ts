import type { Meta, StoryObj } from "@storybook/vue3";

import BaseButton from "./BaseButton.vue";
import ImageCropDialog from "./ImageCropDialog.vue";

const meta: Meta<typeof ImageCropDialog> = {
  title: "Components/Utilities/ImageCropDialog",
  component: ImageCropDialog,
};

export default meta;

type Story = StoryObj<typeof ImageCropDialog>;

export const Default: Story = {
  args: {
    title: "Crop Image",
    stencilType: "circle",
    onSave: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  },
  loaders: [
    async () => {
      const response = await fetch("/images/linus-watering-gpu.png");
      const blob = await response.blob();

      return {
        blob,
      };
    },
  ],
  render: (args, { loaded: { blob } }) => ({
    components: { ImageCropDialog, BaseButton },
    setup() {
      const blobRef = ref<Blob>(blob);

      return { args, blobRef, blob };
    },
    template: `
      <ImageCropDialog v-bind="args" v-model="blobRef">
        <template #activator>
          <BaseButton @click="blobRef = blob">Crop Image</BaseButton>
        </template>
      </ImageCropDialog>
    `,
  }),
};
