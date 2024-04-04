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

const navbarOpened = ref(false);
</script>

<template>
  <div class="overflow-clip">
    <div class="min-h-screen w-[calc(100%_+_15rem)] flex items-stretch md:w-full">
      <NavBar
        :categories="categories"
        class="sticky top-0 max-h-screen shrink-0 transition-transform -translate-x-60 md:translate-x-0"
        :class="{
          '!translate-x-0': navbarOpened,
        }"
      />
      <div
        class="relative grow transition-transform -translate-x-60 md:translate-x-0"
        :class="{
          '!translate-x-0': navbarOpened,
        }"
      >
        <AppHeader class="sticky top-0 z-10" :user="session?.user" @open="navbarOpened = true"  />
        <div class="box-border">
          <slot />

        </div>
        <div
          class="pointer-events-none absolute left-0 top-0 z-20 h-full w-full bg-black opacity-0 md:pointer-events-none md:opacity-0"
          :class="{
            'opacity-50 transition-opacity pointer-events-unset': navbarOpened,
          }"
          @click="navbarOpened = false"
        />
      </div>
    </div>
  </div>
</template>
