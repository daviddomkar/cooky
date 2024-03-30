import type { Meta, StoryObj } from "@storybook/vue3";

import RecipeCard from "./RecipeCard.vue";

const meta = {
  title: "Design System/Business/RecipeCard",
  component: RecipeCard,
} satisfies Meta<typeof RecipeCard>;

export default meta;

type Story = StoryObj<typeof RecipeCard>;

export const Default: Story = {
  args: {
    title: "Pancakes",
    coverImageId: "pancakes.jpg",
    authorName: "Rem Rem",
    authorImageId: "rem.jpg",
    liked: false,
  },
  render: (args) => ({
    components: { RecipeCard },
    setup() {
      return { args };
    },
    template: '<RecipeCard v-bind="args" class="w-[240px]" />',
  }),
};

export const Liked: Story = {
  args: {
    title: "Pancakes",
    coverImageId: "pancakes.jpg",
    authorName: "Rem Rem",
    authorImageId: "rem.jpg",
    liked: true,
  },
  render: (args) => ({
    components: { RecipeCard },
    setup() {
      return { args };
    },
    template: '<RecipeCard v-bind="args" class="w-[240px]" />',
  }),
};
