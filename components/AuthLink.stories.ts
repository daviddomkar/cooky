import type { Meta, StoryObj } from "@storybook/vue3";

import AuthLink from "./AuthLink.vue";

const meta: Meta<typeof AuthLink> = {
  title: "Design System/Base/AuthLink",
  component: AuthLink,
};

export default meta;

type Story = StoryObj<typeof AuthLink>;

export const Login: Story = {
  args: {
    default: "Log in",
    active: true,
  },
  render: (args) => ({
    components: { AuthLink },
    setup() {
      return { args };
    },
    template: '<AuthLink v-bind="args">{{ args.default }}</AuthLink>',
  }),
};
