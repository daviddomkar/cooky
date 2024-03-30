import type { Meta, StoryObj } from "@storybook/vue3";

import RecipeListCard from "./RecipeListCard.vue";

const meta = {
  title: "Design System/Business/RecipeListCard",
  component: RecipeListCard,
} satisfies Meta<typeof RecipeListCard>;

export default meta;

type Story = StoryObj<typeof RecipeListCard>;

export const Default: Story = {
  render: () => ({
    components: { RecipeListCard },
    setup() {
      return {};
    },
    template: '<RecipeListCard v-bind="args" />',
  }),
};
