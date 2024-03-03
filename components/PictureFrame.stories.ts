import type { Meta, StoryObj } from "@storybook/vue3";

import PictureFrame from "./PictureFrame.vue";

const meta: Meta<typeof PictureFrame> = {
  title: "Design System/Misc/PictureFrame",
  component: PictureFrame,
};

export default meta;

type Story = StoryObj<typeof PictureFrame>;

export const Default: Story = {
  args: {
    src: "https://www.homeware.cz/images/clanky/Clanky/palacinky.jpg",
  },
  render: (args) => ({
    components: { PictureFrame },
    setup() {
      return { args };
    },
    template: '<PictureFrame v-bind="args">{{ args.default }}</PictureFrame>',
  }),
};
