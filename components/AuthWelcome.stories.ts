import type { Meta, StoryObj } from "@storybook/vue3";

import AuthWelcome from "./AuthWelcome.vue";
import AuthLink from "./AuthLink.vue";

const meta: Meta<typeof AuthWelcome> = {
  title: "Components/Auth/AuthWelcome",
  component: AuthWelcome,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof AuthWelcome>;

export const Default: Story = {
  render: (args) => ({
    components: { AuthWelcome, AuthLink },
    setup() {
      return { args };
    },
    template:
      '<div class="min-h-screen flex items-stretch"><AuthWelcome class="w-96"><AuthLink :active="true">Sign Up</AuthLink><AuthLink :active="false">Log In</AuthLink></AuthWelcome></div>',
  }),
};
