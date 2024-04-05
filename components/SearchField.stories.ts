import type { Meta, StoryObj } from "@storybook/vue3";

import SearchField from "./SearchField.vue";

const meta = {
  title: "Design System/Business/SearchField",
  component: SearchField,
} satisfies Meta<typeof SearchField>;

export default meta;

type Story = StoryObj<typeof SearchField>;

export const Default: Story = {
  render: (args) => ({
    components: { SearchField },
    setup() {
      return { args };
    },
    template: '<SearchField v-bind="args" />',
  }),
};
