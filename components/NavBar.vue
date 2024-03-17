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
  <nav class="relative h-100% min-w-240px bg-surface-container">
    <div v-if="stripe && selectedItemRect">
      <div id="nav-gradient" class="nav-gradient absolute left-0 top-0 h-100% w-100%"></div>
      <div id="nav-strip" class="nav-gradient absolute right-0 top-0 h-100% w-20px"></div>
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
      <div class="title mb-10 text-center font-size-12 font-display">Cooky</div>
        <div class="font-size-6 color-on-surface-variant font-display">LIBRARY</div>
      <ul class="m-0 p-0">
        <li
          v-for="title in categoryTitles"
          :key="title" :ref="(el) => bindItem(title, el as Element)"
          class="nav-item"
          :class="{
            'bg-transparent text-white':
            title === selectedPage
          }"
        >
          {{ title }}
        </li>
      </ul>
      <div class="on-surface-variant font-size-6 font-display">PROFILE</div>
      <ul class="m-0 p-0">
        <li v-for="title in profileTitles" :key="title" class="nav-item">
          {{ title }}
        </li>
      </ul>
    </div>

    <div v-else class="content relative px-10 py-4">
      <div class="title mb-10 text-center font-size-12 font-display">Cooky</div>
      <ul class="m-0 p-0">
        <li v-for="title in adminTitles" :key="title" class="nav-item">
          {{ title }}
        </li>
      </ul>
    </div>
</nav>
</template>

<style>
#nav-gradient {
  clip-path: url(#clip);
}
@layer components {
  .nav-gradient {
    @apply bg-orange from-#FFBD3E via-#FFA14A to-#FF5F54 bg-gradient-to-b
  }
  .nav-item {
    @apply bg-white mb-4 cursor-pointer list-none rounded-5 px-4 py-2 color-black no-underline
  }
}
</style>
