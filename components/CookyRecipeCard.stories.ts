import type { Meta, StoryObj } from "@storybook/vue3";

import CookyRecipeCard from "./CookyRecipeCard.vue";

const meta = {
  title: "CookyRecipeCard",
  component: CookyRecipeCard,
} satisfies Meta<typeof CookyRecipeCard>;

export default meta;

type Story = StoryObj<typeof CookyRecipeCard>;

export const Default: Story = {
  args: {
    liked: false,
  },
  render: (args) => ({
    components: { CookyRecipeCard },
    setup() {
      return { args };
    },
    template: '<CookyRecipeCard v-bind="args" class="w-[240px]" />',
  }),
};

export const Liked: Story = {
  args: {
    liked: true,
  },
  render: (args) => ({
    components: { CookyRecipeCard },
    setup() {
      return { args };
    },
    template: '<CookyRecipeCard v-bind="args" class="w-[240px]" />',
  }),
};
