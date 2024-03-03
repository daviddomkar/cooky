import type { Meta, StoryObj } from "@storybook/vue3";

import LogInForm from "./LogInForm.vue";

const meta: Meta<typeof LogInForm> = {
  title: "Components/Forms/LogInForm",
  component: LogInForm,
};

export default meta;

type Story = StoryObj<typeof LogInForm>;

export const Default: Story = {
  parameters: {
    layout: "fullscreen",
  },
  args: {},
  render: (args) => ({
    components: { LogInForm },
    setup() {
      return { args };
    },
    template:
      '<div class="box-border flex items-center min-h-screen p-4"><LogInForm v-bind="args" /></div>',
  }),
};
