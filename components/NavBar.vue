<script setup lang="ts">
import type { Category } from '@prisma/client';

type Props = {
  categories: Category[]
};

const props = defineProps<Props>();

const route = useRoute();

const admin = computed(() => route.path.startsWith('/admin'));

const sections = computed(() => {
  return [
    {
      title: "Library",
      hidden: admin.value,
      items: props.categories.map((category) => ({
        title: category.title,
        to: `/category/${category.slug}`,
        icon: category.icon
      }))
    },
    {
      title: "Profile",
      hidden: admin.value,
      items: [
        { title: "My Recipes", to: "/recipes", icon: "my-recipes" },
        { title: "Favourites", to: "/favourites", icon: "favourites" }
      ]
    },
    {
      hidden: !admin.value,
      items: [
        { title: "Recipes", to: "/admin/recipes", icon: "recipes" },
        { title: "Categories", to: "/admin/categories", icon: "list" },
        { title: "Ingredients", to: "/admin/ingredients", icon: "ingredients" },
        { title: "Reviews", to: "/admin/reviews", icon: "reviews" },
        { title: "Users", to: "/admin/users", icon: "users" },
        { title: "Roles", to: "/admin/roles", icon: "roles" }
      ]
    },
  ];
});

const active = computed(() => sections.value.flatMap((section) => section.items).some((item) => route.path.startsWith(item.to)));

const activeItemY = computed(() => {
  if (!active.value) return 0;

  // Start with logo height
  let y = 96;

  for (const section of sections.value) {
    // Skip hidden sections
    if (section.hidden) continue;

    // If section contains a title, add its height
    if (section.title) {
      y += 32;
    }

    for (const item of section.items) {
      // Active item found, return y
      if (route.path.startsWith(item.to)) {
        return y;
      }

      // Add item height
      y += 40;

      // Add gap between items
      if (item !== section.items[section.items.length - 1]) {
        y += 16;
      }
    }

    // Add gap between sections
    if (section !== sections.value[sections.value.length - 1]) {
      y += 32;
    }
  }

  return y;
});

function getSkirtPath(x: number, y: number, height: number, edgeWidth: number, edgeHeight: number) {
  return `M ${x} ${y} c 0 0, ${edgeWidth} 0, ${edgeWidth} -${edgeHeight} l 0 ${height + 2*edgeHeight} c 0 -${edgeHeight} -${edgeWidth} -${edgeHeight} -${edgeWidth} -${edgeHeight} Z`;
}
</script>

<template>
  <nav class="relative box-border min-w-240px bg-surface-container">
    <template v-if="active">
      <div id="nav-gradient" class="absolute left-0 top-0 h-full w-full from-primary to-secondary bg-gradient-to-b -z-1" />
      <div class="absolute right-0 top-0 h-full w-4 from-primary to-secondary bg-gradient-to-b -z-1" />
      <svg class="absolute left-0 top-0 h-full w-full -z-1">
        <clipPath id="clip">
          <rect
            height="2.5rem" rx="1.25rem" :width="`${176 + 32}px`" :x="32" :y="activeItemY - 1"
          />
          <path
            :d="getSkirtPath(176 + 12, activeItemY - 1, 40, 36, 36)"
          />
        </clipPath>
      </svg>
    </template>
    <div class="h-24 flex items-center justify-center">
      <h1 class="relative my-0 block text-center text-5xl">
        <NuxtLink class="decoration-none visited:text-inherit" to="/">Cooky</NuxtLink>
        <span v-if="admin" class="absolute left-0 w-full text-xs font-display uppercase -bottom-3">
          <span class="rounded-full from-primary to-secondary bg-gradient-to-r px-2 text-white tracking-normal">
            Admin
          </span>
        </span>
      </h1>
    </div>
    <div class="flex flex-col gap-8">
      <template v-for="(section, index) in sections" :key="index">
        <section v-if="!section.hidden" class="px-8">
          <h2 v-if="section.title" class="my-0 ml-4 text-on-surface-variant">{{ section.title }}</h2>
          <ul class="my-0 flex flex-col list-none gap-4 pl-0">
            <li v-for="item in section.items" :key="item.to">
              <NuxtLink active-class="bg-transparent" class="box-border h-10 flex items-center rounded-full bg-surface px-4 decoration-none link:text-inherit visited:text-inherit" :to="item.to">
                <div class="mr-2" :class="`i-cooky:${item.icon}`" />
                <span class="uppercase">{{ item.title }}</span>
              </NuxtLink>
            </li>
          </ul>
        </section>
      </template>
    </div>
  </nav>
</template>

<style scoped>
#nav-gradient {
  clip-path: url(#clip);
}
</style>
