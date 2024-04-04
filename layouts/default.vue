<script setup lang="ts">
const { session } = useAuth();

const categories = [
  {
    title: "Breakfast",
    slug: "breakfast",
    icon: "breakfast",
    id: "",
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Lunch",
    slug: "lunch",
    icon: "lunch",
    id: "",
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Dinner",
    slug: "dinner",
    icon: "dinner",
    id: "",
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Snacks",
    slug: "snacks",
    icon: "snacks",
    id: "",
    order: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Soups",
    slug: "soups",
    icon: "soups",
    id: "",
    order: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Sauces",
    slug: "sauces",
    icon: "sauces",
    id: "",
    order: 6,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
</script>

<template>
  <div class="min-h-screen flex items-stretch">
    <NavBar :categories="categories" class="sticky top-0 max-h-screen shrink-0" />
    <div class="grow">
      <AppHeader class="sticky top-0 z-10" :user="session?.user"  />
      <div class="box-border">
        <slot />

      </div>
    </div>
  </div>
</template>
