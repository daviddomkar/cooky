import type { Meta, StoryObj } from "@storybook/vue3";

import CookyButton from "./CookyButton.vue";

const meta = {
  title: "CookyButton",
  component: CookyButton,
} satisfies Meta<typeof CookyButton>;

export default meta;

type Story = StoryObj<typeof CookyButton>;

export const Default: Story = {
  render: () => ({
    components: { CookyButton },
    template: '<CookyButton class="w-[240px]" />',
  }),
};
