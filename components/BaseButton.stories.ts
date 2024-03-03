import type { Meta, StoryObj } from "@storybook/vue3";

import BaseButton from "./BaseButton.vue";

const meta: Meta<typeof BaseButton> = {
  title: "BaseButton",
  component: BaseButton,
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

type Story = StoryObj<typeof BaseButton>;

export const Default: Story = {
  args: {
    variant: "primary",
    default: "Click me",
  },
  render: (args) => ({
    components: { BaseButton },
    setup() {
      return { args };
    },
    template: '<BaseButton v-bind="args">{{ args.default }}</BaseButton>',
  }),
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    default: "Click me",
  },
  render: (args) => ({
    components: { BaseButton },
    setup() {
      return { args };
    },
    template: '<BaseButton v-bind="args">{{ args.default }}</BaseButton>',
  }),
};

export const Text: Story = {
  args: {
    variant: "text",
    default: "Click me",
  },
  render: (args) => ({
    components: { BaseButton },
    setup() {
      return { args };
    },
    template: '<BaseButton v-bind="args">{{ args.default }}</BaseButton>',
  }),
};
