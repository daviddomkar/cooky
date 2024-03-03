import type { Meta, StoryObj } from "@storybook/vue3";

import SignUpForm from "./SignUpForm.vue";

const meta: Meta<typeof SignUpForm> = {
  title: "Components/Forms/SignUpForm",
  component: SignUpForm,
};

export default meta;

type Story = StoryObj<typeof SignUpForm>;

export const Default: Story = {
  parameters: {
    layout: "fullscreen",
  },
  args: {},
  render: (args) => ({
    components: { SignUpForm },
    setup() {
      return { args };
    },
    template:
      '<div class="box-border flex items-center min-h-screen p-4"><SignUpForm v-bind="args" /></div>',
  }),
};
