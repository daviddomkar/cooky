import type { Meta, StoryObj } from "@storybook/vue3";

import CookyRecipeCard from "./CookyRecipeCard.vue";

const meta = {
  title: "CookyRecipeCard",
  component: CookyRecipeCard,
} satisfies Meta<typeof CookyRecipeCard>;

export default meta;

type Story = StoryObj<typeof CookyRecipeCard>;

export const Default: Story = {
  render: () => ({
    components: { CookyRecipeCard },
    template: '<CookyRecipeCard class="w-[240px]" />',
  }),
};
