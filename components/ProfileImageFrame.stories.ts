import type { Meta, StoryObj } from "@storybook/vue3";

import ProfileImageFrame from "./ProfileImageFrame.vue";

const meta = {
  title: "Components/Profile/ProfileImageFrame",
  component: ProfileImageFrame,
} satisfies Meta<typeof ProfileImageFrame>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    username: "johnsmith",
    onNewProfileImage: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  },
  render: (args) => ({
    components: { ProfileImageFrame },
    setup() {
      return { args };
    },
    template: '<ProfileImageFrame v-bind="args" class="w-48 h-48" />',
  }),
};

export const WithCustomProfileImage: Story = {
  args: {
    username: "johnsmith",
    profileImageId: "sample-profile-image.gif",
    onNewProfileImage: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  },
  render: (args) => ({
    components: { ProfileImageFrame },
    setup() {
      return { args };
    },
    template: '<ProfileImageFrame v-bind="args" class="w-48 h-48" />',
  }),
};

export const Editable: Story = {
  args: {
    username: "johnsmith",
    profileImageId: "sample-profile-image.gif",
    editable: true,
    onNewProfileImage: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  },
  render: (args) => ({
    components: { ProfileImageFrame },
    setup() {
      return { args };
    },
    template: '<ProfileImageFrame v-bind="args" class="w-48 h-48" />',
  }),
};
