<script setup lang="ts">
import type { Category } from '@prisma/client';

type NavItem = {
  title: string,
  icon: string,
  slug: string
}

type Props = {
  variant?: "user" | "admin";
  stripe?: boolean,
  categories?: Category[]
};

withDefaults(defineProps<Props>(), {
  variant: "user",
  stripe: true,
  categories: () => []
});

const profileItems = ref<NavItem[]>([
  { title: "MY RECIPES", slug: "recipes", icon: "recipes" },
  { title: "FAVOURITES", slug: "favourites", icon: "favourites" }
]);
const adminItems = ref<NavItem[]>([
  { title: "RECIPES", slug: "recipes", icon: "recipes" },
  { title: "CATEGORIES", slug: "categories", icon: "categories" },
  { title: "INGREDIENTS", slug: "ingredients", icon: "ingredients" }, 
  { title: "REVIEWS", slug: "reviews", icon: "reviews" }, 
  { title: "USERS", slug: "users", icon: "users" }, 
  { title: "ROLES", slug: "roles", icon: "roles" }, 
]);

type ItemRect = {
  x: number,
  y: number,
  width: number,
  height: number
}

const { signOut } = useAuth();
const route = useRoute();
const selectedItem = ref<HTMLElement>();
const selectedItemRect = ref<ItemRect>();

function isSelected(path: string) {
  return route && path === route.path
}

function bindItem(path: string, element: Element | ComponentPublicInstance | null) {
  if(element && isSelected(path)){
    selectedItem.value = element as HTMLElement;
  }
}

function getSkirtPath(x: number, y: number, height: number, edgeWidth: number, edgeHeight: number) {
  return `M ${x} ${y} c 0 0, ${edgeWidth} 0, ${edgeWidth} -${edgeHeight} l 0 ${height + 2*edgeHeight} c 0 -${edgeHeight} -${edgeWidth} -${edgeHeight} -${edgeWidth} -${edgeHeight} Z`;
}

function updateRect() {
  if(!selectedItem.value) return;
  selectedItemRect.value = {
    x: selectedItem.value.offsetLeft,
    y: selectedItem.value.offsetTop,
    width: selectedItem.value.clientWidth,
    height: selectedItem.value.clientHeight
  };
}

useNuxtApp().hook('page:finish', () => {
  updateRect();
});

</script>

<template>
  <nav class="relative h-100% min-w-240px bg-surface-container">
    <div v-if="stripe && selectedItemRect">
    <!-- BG GRADIENT -->
      <div id="nav-gradient" class="absolute left-0 top-0 h-100% w-100% bg-orange from-#FFBD3E via-#FFA14A to-#FF5F54 bg-gradient-to-b"></div>
      <div id="nav-strip" class="absolute right-0 top-0 h-100% w-20px bg-orange from-#FFBD3E via-#FFA14A to-#FF5F54 bg-gradient-to-b"></div>
      <svg id="nav-svg" class="absolute left-0 top-0 h-100% w-100%">
        <clipPath id="clip">
          <rect
            id="rect"
            :height="selectedItemRect.height" rx="1rem" width="100%" :x="selectedItemRect.x" :y="selectedItemRect.y"
          />
          <path
            id="skirt"
            :d="getSkirtPath(selectedItemRect.x + selectedItemRect.width, selectedItemRect.y, selectedItemRect.height, 20, 20)"
          />
        </clipPath>
      </svg>
    </div>
    <div v-if="variant === 'user'" class="content relative px-10 py-4">
    <!-- USER NAV -->
      <div class="title mb-10 text-center font-size-12 font-display">Cooky</div>
        <div class="font-size-6 color-on-surface-variant font-display">LIBRARY</div>
      <ul class="m-0 p-0">
        <li
          v-for="category in categories"
          :key="category.slug" :ref="(el) => bindItem(`/category/${category.slug}`, el)"
          class="mb-4 list-none no-underline"
        >
          <NuxtLink
          active-class="bg-transparent text-white"
          class="mb-4 block cursor-pointer rounded-5 bg-surface px-4 py-2 text-on-surface no-underline"
          :to="`/category/${category.slug}`"
          >
            <div :class="`i-cooky:${category.icon} float-left h-4 w-4`" />&nbsp;{{ category.title.toUpperCase() }}
          </NuxtLink>
        </li>
      </ul>
      <div class="font-size-6 color-on-surface-variant font-display">PROFILE</div>
      <ul class="m-0 p-0">
        <li
          v-for="item in profileItems"
          :key="item.slug"
          :ref="(el) => bindItem(`/profile/${item.slug}`, el)"
          class="list-none no-underline"
        >
          <NuxtLink
            active-class="bg-transparent text-white"
            class="mb-4 block cursor-pointer rounded-5 bg-surface px-4 py-2 text-on-surface no-underline"
            :to="`/profile/${item.slug}`"
          >
            <div :class="`i-cooky:${item.icon} float-left h-4 w-4`" />&nbsp;{{ item.title.toUpperCase() }}
          </NuxtLink>
        </li>
      </ul>
    </div>
    <div v-else class="content relative h-100% flex flex-col px-10 py-4">
    <!-- ADMIN NAV -->
      <div id="admin-title" class="title relative mb-10 text-center font-size-12 font-display">Cooky</div>
      <ul class="m-0 p-0">
        <li
          v-for="item in adminItems"
          :key="item.slug"
          :ref="(el) => bindItem(`/admin/${item.slug}`, el)"
          class="mb-4 list-none no-underline"
        >
          <NuxtLink
            active-class="bg-transparent text-white"
            class="mb-4 block cursor-pointer rounded-5 bg-surface px-4 py-2 text-on-surface no-underline"
            :to="`/admin/${item.slug}`"
          >
            <div :class="`i-cooky:${item.icon} float-left h-4 w-4`" />&nbsp;{{ item.title.toUpperCase() }}
          </NuxtLink>
        </li>
      </ul>
      <div class="m-0 flex flex-grow-1 flex-col items-stretch justify-end pb-4">
        <BaseButton class="mb-4">COOKY</BaseButton>
        <BaseButton class="mb-4" @click="signOut">LOG OUT</BaseButton>
      </div>
    </div>
</nav>
</template>

<style>
#nav-gradient {
  clip-path: url(#clip);
}
#admin-title:after {
  content: "ADMIN";
  position: absolute;
  top:80%;left:50%;
  transform: translateX(-50%);
  font-size: 0.7rem;
  color: white;
  background-image: linear-gradient(to right, rgb(var(--un-preset-theme-colors-primary)), rgb(var(--un-preset-theme-colors-secondary)));
  border-radius: 1rem;
  padding: 0 0.5rem;
}
</style>
