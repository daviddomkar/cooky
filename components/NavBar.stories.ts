import type { Meta, StoryObj } from "@storybook/vue3";

import NavBar from "./NavBar.vue";

const meta: Meta<typeof NavBar> = {
  title: "NavBar",
  component: NavBar,
  argTypes: {
    variant: {
      options: ["user", "admin"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof NavBar>;

export const Primary: Story = {
  args: {
    variant: "user",
    stripe: true,
  },
  render: (args) => ({
    components: { NavBar },
    setup() {
      return { args };
    },
    template: '<NavBar v-bind="args"/>',
  }),
};

export const Secondary: Story = {
  args: {
    variant: "admin",
    stripe: true,
  },
  render: (args) => ({
    components: { NavBar },
    setup() {
      return { args };
    },
    template: '<NavBar v-bind="args"/>',
  }),
};
