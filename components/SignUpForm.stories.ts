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

export const Filled: Story = {
  parameters: {
    layout: "fullscreen",
  },
  args: {
    initialValues: {
      name: "John Smith",
      username: "johnsmith",
      email: "john.smith@example.com",
      password: "Hh8GH33ddc6y",
      confirmPassword: "Hh8GH33ddc6y",
      agreedToTermsAndPrivacyPolicy: true,
    },
    onSubmit: (_) => new Promise((resolve) => setTimeout(resolve, 1000)),
  },
  render: (args) => ({
    components: { SignUpForm },
    setup() {
      return { args };
    },
    template:
      '<div class="box-border flex items-center min-h-screen p-4"><SignUpForm v-bind="args" /></div>',
  }),
};
