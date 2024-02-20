import type { Meta, StoryObj } from "@storybook/vue3";

import CookyButton from "./CookyButton.vue";

const meta: Meta<typeof CookyButton> = {
  title: "CookyButton",
  component: CookyButton,
  argTypes: {
    backgroundColorOption: {
      control: { type: "select", options: ["gray", "gradient"] },
      defaultValue: "gradient",
    },
    textColor: {
      control: { type: "select", options: ["white", "black"] },
      defaultValue: "white",
    },
    text: {
      control: "text",
      defaultValue: "Click me",
    },
    height: {
      control: { type: "select", options: [40, 50] },
      defaultValue: 40,
    },
  },
};

export default meta;

type Story = StoryObj<typeof CookyButton>;

export const Default: Story = {
  args: {
    backgroundColorOption: "gradient",
    textColor: "white",
    text: "Click me",
    height: 40,
  },
  render: (args) => ({
    components: { CookyButton },
    setup() {
      return { args };
    },
    template: '<CookyButton v-bind="args" class="w-[240px]" />',
  }),
};
