<script setup lang="ts">

type Props = {
  variant?: "primary" | "secondary";
};

withDefaults(defineProps<Props>(), {
  variant: "primary",
});

const categoryTitles = ref(["BREAKFAST", "LUNCH", "DINNER", "SNACKS", "SOUPS", "SAUCES"]);

</script>

<template>
  <nav class="relative h-100% min-w-240px bg-surface-container">
    <div v-if="stripe">
      <div id="nav-gradient" class="nav-gradient absolute left-0 top-0 h-100% w-100%"></div>
      <div id="nav-strip" class="nav-gradient absolute right-0 top-0 h-100% w-20px"></div>
      <svg id="nav-svg" class="absolute left-0 top-0 h-100% w-100%">
        <clipPath id="clip">
          <rect id="hole" height="0" width="0"/>
          <path id="skirt"/>
        </clipPath>
      </svg>
    </div>
  
    <div v-if="variant === 'user'" class="content relative px-10 py-4">
      <div class="title mb-10 text-center font-size-12 font-display">Cooky</div>
        <div class="font-size-6 color-surface-variant font-display">LIBRARY</div>
      <ul class="m-0 p-0">
        <li v-for="category in categoryTitles" :key="category" class="nav-item">
          {{ category }}
        </li>
      </ul>
      <div class="font-size-6 color-surface-variant font-display">PROFILE</div>
      <ul class="m-0 p-0">
        <li v-for="title in profileTitles" :key="title" class="nav-item">
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
    @apply mb-4 cursor-pointer list-none rounded-5 bg-white px-4 py-2 color-black no-underline
  }
}
</style>
