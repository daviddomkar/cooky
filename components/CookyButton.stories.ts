import type { Meta, StoryObj } from "@storybook/vue3";

import CookyButton from "./CookyButton.vue";

const meta: Meta<typeof CookyButton> = {
  title: "CookyButton",
  component: CookyButton,
  argTypes: {
    variant: {
      options: ["primary", "secondary", "text"],
      control: { type: "radio" },
    },
    default: {
      control: { type: "text" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof CookyButton>;

export const Default: Story = {
  args: {
    variant: "primary",
    default: "Click me",
  },
  render: (args) => ({
    components: { CookyButton },
    setup() {
      return { args };
    },
    template: '<CookyButton v-bind="args">{{ args.default }}</CookyButton>',
  }),
};
