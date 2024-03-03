import type { Meta, StoryObj } from "@storybook/vue3";

import TextField from "./TextField.vue";

const meta: Meta<typeof TextField> = {
  title: "TextField",
  component: TextField,
};

export default meta;

type Story = StoryObj<typeof TextField>;

export const Default: Story = {
  args: {
    label: "Username / Email",
    name: "username",
  },
  render: (args) => ({
    components: { TextField },
    setup() {
      return { args };
    },
    template: '<TextField v-bind="args">{{ args.default }}</TextField>',
  }),
};
