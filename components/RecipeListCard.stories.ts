import type { Meta, StoryObj } from "@storybook/vue3";

import RecipeListCard from "./RecipeListCard.vue";

const meta = {
  title: "Design System/Business/RecipeListCard",
  component: RecipeListCard,
} satisfies Meta<typeof RecipeListCard>;

export default meta;

type Story = StoryObj<typeof RecipeListCard>;

export const Default: Story = {
  args: {
    coverImageId: "pancakes.jpg",
    title: "Pancakes",
  },
  render: (args) => ({
    components: { RecipeListCard },
    setup() {
      return { args };
    },
    template: '<RecipeListCard v-bind="args" />',
  }),
};
