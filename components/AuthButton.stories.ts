import type { Meta, StoryObj } from "@storybook/vue3";

import AuthButton from "./AuthButton.vue";

const meta: Meta<typeof AuthButton> = {
  title: "AuthButton",
  component: AuthButton,
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

type Story = StoryObj<typeof AuthButton>;

export const Default: Story = {
  args: {
    variant: "primary",
    default: "Click me",
  },
  render: (args) => ({
    components: { AuthButton },
    setup() {
      return { args };
    },
    template: '<AuthButton v-bind="args">{{ args.default }}</AuthButton>',
  }),
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    default: "Click me",
  },
  render: (args) => ({
    components: { AuthButton },
    setup() {
      return { args };
    },
    template: '<AuthButton v-bind="args">{{ args.default }}</AuthButton>',
  }),
};

export const Text: Story = {
  args: {
    variant: "text",
    default: "Click me",
  },
  render: (args) => ({
    components: { AuthButton },
    setup() {
      return { args };
    },
    template: '<AuthButton v-bind="args">{{ args.default }}</AuthButton>',
  }),
};
