import type { Meta, StoryObj } from "@storybook/vue3";

import ProgressIndicator from "./ProgressIndicator.vue";

const meta = {
  title: "Design System/Base/ProgressIndicator",
  component: ProgressIndicator,
  parameters: {
    themes: {
      themeOverride: "dark",
    },
  },
} satisfies Meta<typeof ProgressIndicator>;

export default meta;

type Story = StoryObj<typeof ProgressIndicator>;

export const Default: Story = {
  render: (args) => ({
    setup() {
      return { args };
    },
    components: { ProgressIndicator },
    template:
      '<ProgressIndicator v-bind="args">{{ args.default }}</ProgressIndicator>',
  }),
};
