import type { Meta, StoryObj } from "@storybook/vue3";

import AuthButton from "./AuthButton.vue";

const meta: Meta<typeof AuthButton> = {
  title: "Design System/Base/AuthButton",
  component: AuthButton,
};

export default meta;

type Story = StoryObj<typeof AuthButton>;

export const Login: Story = {
  args: {
    active: true,
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
