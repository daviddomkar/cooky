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
  <nav>
    <div class="gradient"></div>
    <div class="strip"></div>
    <svg id="svg">
      <clipPath id="clip">
        <rect id="hole" height="0" width="0"/>
        <path id="skirt"/>
      </clipPath>
    </svg>
  <div class="content">
    <div class="title">Cooky</div>
    <ul>
      <li v-for="category in categoryTitles" :key="category">
        {{ category }}
      </li>
    </ul>
  </div>
</nav>
</template>
