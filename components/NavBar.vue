<script setup lang="ts">
import NuxtLink from "#app/components/nuxt-link";

type Props = {
  user?: {
    username: string;
    favoritesListId?: string | null;
    permissions: string[];
  };
  categories: { title: string; slug: string; icon: string }[];
};

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "log-in"): void;
  (e: "log-out"): void;
}>();

const route = useRoute();

const getSkirtPath = (
  x: number,
  y: number,
  height: number,
  edgeWidth: number,
  edgeHeight: number,
) => {
  return `M ${x} ${y} c 0 0, ${edgeWidth} 0, ${edgeWidth} -${edgeHeight} l 0 ${height + 2 * edgeHeight} c 0 -${edgeHeight} -${edgeWidth} -${edgeHeight} -${edgeWidth} -${edgeHeight} Z`;
};

const admin = computed(
  () => route.path.startsWith("/admin/") || route.path === "/admin",
);

const sections = computed(() => {
  return [
    {
      title: "Library",
      hidden: admin.value,
      items: props.categories.map((category) => ({
        title: category.title,
        to: `/category/${category.slug}`,
        icon: category.icon,
        exact: false,
        hidden: false,
      })),
    },
    {
      title: "Profile",
      hidden: admin.value || !props.user,
      items: [
        {
          title: "My Recipes",
          to: `/${props.user?.username}`,
          icon: "my-recipes",
          exact: true,
          hidden: false,
        },
        {
          title: "Favourites",
          to: `/list/${props.user?.favoritesListId}`,
          icon: "favourites",
          exact: false,
          hidden: false,
        },
      ],
    },
    {
      hidden: !admin.value,
      items: [
        {
          title: "Categories",
          to: "/admin/categories",
          icon: "list",
          exact: false,
          hidden: !props.user?.permissions?.includes(
            permissions.CategoriesList,
          ),
        },
        {
          title: "Units",
          to: "/admin/units",
          icon: "ingredients",
          exact: false,
          hidden: !props.user?.permissions?.includes(permissions.UnitsList),
        },
        {
          title: "Users",
          to: "/admin/users",
          icon: "users",
          exact: false,
          hidden: !props.user?.permissions?.includes(permissions.UsersList),
        },
        {
          title: "Roles",
          to: "/admin/roles",
          icon: "roles",
          exact: false,
          hidden: !props.user?.permissions?.includes(permissions.RolesList),
        },
      ],
    },
  ];
});

const active = computed(() =>
  sections.value
    .flatMap((section) => section.items)
    .some((item) =>
      item.exact ? route.path === item.to : route.path.startsWith(item.to),
    ),
);

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
      if (
        item.exact ? route.path === item.to : route.path.startsWith(item.to)
      ) {
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
</script>

<template>
  <nav
    class="relative z-1 box-border min-w-60 flex flex-col bg-surface-container"
  >
    <template v-if="active">
      <div
        class="[clip-path:url(#clip)] absolute left-0 top-0 h-full w-full from-primary to-secondary bg-gradient-to-b -z-1"
      />
      <div
        class="absolute right-0 top-0 h-full w-4 from-primary to-secondary bg-gradient-to-b -z-1"
      />
      <svg class="absolute left-0 top-0 h-full w-full -z-1">
        <clipPath id="clip">
          <rect
            height="2.5rem"
            rx="1.25rem"
            :width="`${176 + 32}px`"
            :x="32"
            :y="activeItemY - 1"
          />
          <path :d="getSkirtPath(176 + 12, activeItemY - 1, 40, 36, 36)" />
        </clipPath>
      </svg>
    </template>
    <div class="h-24 flex shrink-0 items-center justify-center">
      <h1
        class="relative my-0 block text-center text-5xl transition-transform hover:active:scale-[0.97]"
      >
        <NuxtLink
          class="decoration-none link:text-inherit visited:text-inherit"
          :to="admin ? '/admin' : '/'"
        >
          Cooky
        </NuxtLink>
        <span
          v-if="admin"
          class="absolute left-0 w-full text-xs font-display uppercase -bottom-3"
        >
          <span
            class="rounded-full from-primary to-secondary bg-gradient-to-r px-2 text-white tracking-normal"
          >
            Admin
          </span>
        </span>
      </h1>
    </div>
    <div class="box-border flex grow flex-col gap-8 pb-8">
      <template v-for="(section, index) in sections" :key="index">
        <section v-if="!section.hidden" class="box-border px-8">
          <h2 v-if="section.title" class="my-0 ml-4 text-on-surface-variant">{{
            section.title
          }}</h2>
          <ul class="my-0 flex flex-col list-none gap-4 pl-0">
            <template v-for="item in section.items" :key="item.to">
              <li v-if="!item.hidden">
                <NuxtLink
                  class="box-border h-10 flex items-center gap-2 rounded-full bg-surface px-4 decoration-none transition-transform link:text-inherit visited:text-inherit hover:active:scale-[0.97]"
                  :class="{
                    '!bg-transparent !text-white': item.exact
                      ? route.path === item.to
                      : route.path.startsWith(item.to),
                  }"
                  :to="item.to"
                >
                  <div :class="`i-cooky:${item.icon}`" />
                  <span class="uppercase">{{ item.title }}</span>
                </NuxtLink>
              </li>
            </template>
          </ul>
        </section>
      </template>
      <div
        v-if="props.user"
        class="box-border w-full flex grow flex-col justify-end gap-4 px-8"
      >
        <BaseButton
          v-if="props.user.permissions.length > 0 && admin"
          :as="NuxtLink"
          expanded
          spread="compact"
          to="/"
        >
          <template #icon>
            <div class="i-cooky:cooky" />
          </template>
          Cooky
        </BaseButton>
        <BaseButton
          v-if="props.user.permissions.length > 0 && !admin"
          :as="NuxtLink"
          expanded
          spread="compact"
          to="/admin"
        >
          <template #icon>
            <div class="i-cooky:admin" />
          </template>
          Admin
        </BaseButton>
        <BaseButton expanded spread="compact" @click="emit('log-out')">
          <template #icon>
            <div class="i-cooky:logout" />
          </template>
          Log out
        </BaseButton>
      </div>
      <div
        v-else
        class="box-border w-full flex grow flex-col justify-end gap-4 px-8 md:hidden"
      >
        <BaseButton expanded spread="compact" @click="emit('log-in')">
          <template #icon>
            <div class="i-material-symbols:login" />
          </template>
          Log In
        </BaseButton>
      </div>
    </div>
  </nav>
</template>
