import type { Meta, StoryObj } from "@storybook/vue3";

import ProfileCoverImageHeader from "./ProfileCoverImageHeader.vue";

const meta = {
  title: "Components/Profile/ProfileCoverImageHeader",
  component: ProfileCoverImageHeader,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ProfileCoverImageHeader>;

export default meta;

type Story = StoryObj<typeof ProfileCoverImageHeader>;

export const Default: Story = {
  args: {
    onNewCoverImage: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  },
  render: (args) => ({
    components: { ProfileCoverImageHeader },
    setup() {
      return { args };
    },
    template: '<ProfileCoverImageHeader v-bind="args" />',
  }),
};

export const WithCustomCoverImage: Story = {
  args: {
    coverImageId: "sample-cover-image.gif",
    onNewCoverImage: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  },
  render: (args) => ({
    components: { ProfileCoverImageHeader },
    setup() {
      return { args };
    },
    template: '<ProfileCoverImageHeader v-bind="args" />',
  }),
};

export const Editable: Story = {
  args: {
    editable: true,
    coverImageId: "sample-cover-image.gif",
    onNewCoverImage: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  },
  render: (args) => ({
    components: { ProfileCoverImageHeader },
    setup() {
      return { args };
    },
    template: '<ProfileCoverImageHeader v-bind="args" />',
  }),
};
