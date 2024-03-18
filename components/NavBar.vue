<script setup lang="ts">

type Props = {
  variant?: "user" | "admin";
  stripe?: boolean,
  selectedPage?: string
};

const props = withDefaults(defineProps<Props>(), {
  variant: "user",
  stripe: true,
  selectedPage: "LUNCH"
});

const categoryTitles = ref(["BREAKFAST", "LUNCH", "DINNER", "SNACKS", "SOUPS", "SAUCES"]);
const profileTitles = ref(["MY RECIPES", "FAVOURITES"]);
const adminTitles = ref(["RECIPES", "CATEGORIES", "INGREDIENTS", "REVIEWS", "USERS", "ROLES"]);

type ItemRect = {
  x: number,
  y: number,
  width: number,
  height: number
}

const selectedItem = ref<HTMLElement>();
const selectedItemRect = ref<ItemRect>();

function bindItem(title: string, element: Element) {
  if(element && title === props.selectedPage){
    selectedItem.value = element as HTMLElement;
  }
}

function updateRect() {
  if(!selectedItem.value) return;
  selectedItemRect.value = {
    x: selectedItem.value?.offsetLeft,
    y: selectedItem.value?.offsetTop,
    width: selectedItem.value?.clientWidth,
    height: selectedItem.value?.clientHeight
  };
}

onMounted(() => updateRect());

function getSkirtPath(x: number, y: number, height: number, edgeWidth: number, edgeHeight: number) {
  return `M ${x} ${y} c 0 0, ${edgeWidth} 0, ${edgeWidth} -${edgeHeight} l 0 ${height + 2*edgeHeight} c 0 -${edgeHeight} -${edgeWidth} -${edgeHeight} -${edgeWidth} -${edgeHeight} Z`;
}

</script>

<template>
  <nav class="relative h-100% min-w-240px w-fit bg-surface-container">
    <!-- BG GRADIENT -->
    <div v-if="stripe && selectedItemRect">
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
    <!-- USER NAV -->
    <div v-if="variant === 'user'" class="content relative px-10 py-4">
      <div class="title mb-10 text-center font-size-12 font-display">Cooky</div>
        <div class="font-size-6 color-on-surface-variant font-display">LIBRARY</div>
      <ul v-if="categoryTitles" class="m-0 p-0">
        <li
          v-for="category in categoryTitles"
          :key="category.title" :ref="(el) => bindItem(`/category/${category.title}`, el)"
          class="mb-4 list-none no-underline"
        >
          <NuxtLink
          active-class="bg-transparent text-white"
          class="mb-4 block cursor-pointer rounded-5 bg-surface px-4 py-2 text-on-surface no-underline"
          :to="`/category/${category.title}`"
          >
            {{ category.title }}
          </NuxtLink>
        </li>
      </ul>
      <div class="font-size-6 color-on-surface-variant font-display">PROFILE</div>
      <ul class="m-0 p-0">
        <li
          v-for="title in profileTitles"
          :key="title"
          :ref="(el) => bindItem(`/auth/${title}`, el)"
          class="list-none no-underline"
        >
          <NuxtLink
            active-class="bg-transparent text-white"
            class="mb-4 block cursor-pointer rounded-5 bg-surface px-4 py-2 text-on-surface no-underline"
            :to="`/auth/${title}`"
          >
            {{ title }}
          </NuxtLink>
        </li>
      </ul>
    </div>
    <!-- ADMIN NAV -->
    <div v-else class="content relative px-10 py-4">
      <div class="title mb-10 text-center font-size-12 font-display">Cooky</div>
      <ul class="m-0 p-0">
        <li
          v-for="title in adminTitles"
          :key="title"
          :ref="(el) => bindItem(`/admin/${title}`, el)"
          class="mb-4 list-none no-underline"
        >
          <NuxtLink
            active-class="bg-transparent text-white"
            class="mb-4 block cursor-pointer rounded-5 bg-surface px-4 py-2 text-on-surface no-underline"
            :to="`/admin/${title}`"
          >
            {{ title }}
          </NuxtLink>
        </li>
      </ul>
    </div>
</nav>
</template>

<style>
#nav-gradient {
  clip-path: url(#clip);
}
</style>
