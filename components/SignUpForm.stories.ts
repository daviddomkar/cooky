import type { Meta, StoryObj } from "@storybook/vue3";

import SignUpForm from "./SignUpForm.vue";

const meta: Meta<typeof SignUpForm> = {
  title: "Components/Forms/SignUpForm",
  component: SignUpForm,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof SignUpForm>;

export const Default: Story = {
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
  args: {
    initialValues: {
      name: "John Smith",
      username: "johnsmith",
      email: "john.smith@example.com",
      password: "Hh8GH33ddc6y",
      confirmPassword: "Hh8GH33ddc6y",
      agreedToTermsAndPrivacyPolicy: true,
    },
    onSubmit: async (_, { resetForm }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      resetForm({
        values: {
          name: "",
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          agreedToTermsAndPrivacyPolicy: false,
        },
      });
    },
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
