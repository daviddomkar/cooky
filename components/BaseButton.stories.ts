import type { Meta, StoryObj } from "@storybook/vue3";

import BaseButton from "./BaseButton.vue";

const meta: Meta<typeof BaseButton> = {
  title: "Design System/Base/BaseButton",
  component: BaseButton,
  argTypes: {
    variant: {
      options: ["primary", "secondary", "danger"],
      control: { type: "radio" },
    },
    default: {
      control: { type: "text" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof BaseButton>;

export const Primary: Story = {
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

export const Danger: Story = {
  args: {
    variant: "danger",
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

export const Expanded: Story = {
  args: {
    variant: "primary",
    default: "Click me",
    expanded: true,
  },
  render: (args) => ({
    components: { BaseButton },
    setup() {
      return { args };
    },
    template: `
    <div class="w-[90vw]">
      <BaseButton v-bind="args">{{ args.default }}</BaseButton>
    </div>`,
  }),
};

export const Loading: Story = {
  args: {
    variant: "primary",
    default: "Click me",
    loading: true,
  },
  render: (args) => ({
    components: { BaseButton },
    setup() {
      return { args };
    },
    template: '<BaseButton v-bind="args">{{ args.default }}</BaseButton>',
  }),
};

export const Disabled: Story = {
  args: {
    variant: "primary",
    default: "Click me",
    disabled: true,
  },
  render: (args) => ({
    components: { BaseButton },
    setup() {
      return { args };
    },
    template: '<BaseButton v-bind="args">{{ args.default }}</BaseButton>',
  }),
};
