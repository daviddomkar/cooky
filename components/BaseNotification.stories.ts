import type { Meta, StoryObj } from "@storybook/vue3";

import BaseNotification from "./BaseNotification.vue";

const meta = {
  title: "Design System/Base/BaseNotification",
  component: BaseNotification,
} satisfies Meta<typeof BaseNotification>;

export default meta;

type Story = StoryObj<typeof BaseNotification>;

export const Default: Story = {
  args: {},
  render: (args) => ({
    setup() {
      return { args };
    },
    components: { BaseNotification },
    template: '<BaseNotification v-bind="args" />',
  }),
};
