import type { Meta, StoryObj } from "@storybook/vue3";

import CustomIcons from "./CustomIcons.vue";

const meta = {
  title: "Design System/Base/CustomIcons",
  component: CustomIcons,
} satisfies Meta<typeof CustomIcons>;

export default meta;

type Story = StoryObj<typeof CustomIcons>;

export const Default: Story = {
  render: (args) => ({
    setup() {
      return { args };
    },
    components: { CustomIcons },
    template: '<CustomIcons v-bind="args"></CustomIcons>',
  }),
};
