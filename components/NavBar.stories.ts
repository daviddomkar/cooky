import type { Meta, StoryObj } from "@storybook/vue3";

import type { Category } from "@prisma/client";
import NavBar from "./NavBar.vue";

const meta: Meta<typeof NavBar> = {
  title: "NavBar",
  component: NavBar,
  argTypes: {
    variant: {
      options: ["user", "admin"],
    },
  },
};

export default meta;

const categoryItems: Category[] = [
  {
    title: "BREAKFAST",
    slug: "breakfast",
    icon: "breakfast",
    id: "",
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "LUNCH",
    slug: "lunch",
    icon: "lunch",
    id: "",
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "DINNER",
    slug: "dinner",
    icon: "dinner",
    id: "",
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "SNACKS",
    slug: "snacks",
    icon: "snacks",
    id: "",
    order: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "SOUPS",
    slug: "soups",
    icon: "soups",
    id: "",
    order: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "SAUCES",
    slug: "sauces",
    icon: "sauces",
    id: "",
    order: 6,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

type Story = StoryObj<typeof NavBar>;

export const Primary: Story = {
  args: {
    variant: "user",
    stripe: true,
    categories: categoryItems,
  },
  render: (args) => ({
    components: { NavBar },
    setup() {
      return { args };
    },
    template: '<NavBar v-bind="args"/>',
  }),
};

export const Secondary: Story = {
  args: {
    variant: "admin",
    stripe: true,
  },
  render: (args) => ({
    components: { NavBar },
    setup() {
      return { args };
    },
    template: '<NavBar v-bind="args"/>',
  }),
};
