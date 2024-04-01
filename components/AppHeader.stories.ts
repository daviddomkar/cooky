import type { Meta, StoryObj } from "@storybook/vue3";

import AppHeader from "./AppHeader.vue";

const meta: Meta<typeof AppHeader> = {
  title: "Components/Layout/AppHeader",
  component: AppHeader,
};

export default meta;

type Story = StoryObj<typeof AppHeader>;

export const Default: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => ({
    components: { AppHeader },
    setup() {
      return { args };
    },
    template: '<AppHeader v-bind="args" />',
  }),
};
