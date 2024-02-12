import type { Meta, StoryObj } from "@storybook/vue3";

import RecipeCard from "./RecipeCard.vue";

const meta = {
  title: "RecipeCard",
  component: RecipeCard,
} satisfies Meta<typeof RecipeCard>;

export default meta;

type Story = StoryObj<typeof RecipeCard>;

export const Default: Story = {
  render: () => ({
    components: { RecipeCard },
    template: '<RecipeCard class="w-[240px]" />',
  }),
};
