import type { Meta, StoryObj } from "@storybook/vue3";

import AppBar from "./AppBar.vue";

const meta: Meta<typeof AppBar> = {
  title: "Components/BaseComponents/AppBar",
  component: AppBar,
};

export default meta;

type Story = StoryObj<typeof AppBar>;

export const Default: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => ({
    components: { AppBar },
    setup() {
      return { args };
    },
    template: '<AppBar v-bind="args" />',
  }),
};
