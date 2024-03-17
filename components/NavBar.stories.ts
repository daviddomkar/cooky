import type { Meta, StoryObj } from "@storybook/vue3";

import NavBar from "./NavBar.vue";

const meta: Meta<typeof NavBar> = {
  title: "NavBar",
  component: NavBar,
  argTypes: {
    variant: {
      options: ["primary", "secondary"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof NavBar>;

export const Primary: Story = {
  args: {
    variant: "primary",
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
    variant: "secondary",
  },
  render: (args) => ({
    components: { NavBar },
    setup() {
      return { args };
    },
    template: '<NavBar v-bind="args"/>',
  }),
};
