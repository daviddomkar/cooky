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
    <ul>
      <li v-for="category in categoryTitles" :key="category">
        {{ category }}
      </li>
    </ul>
  </nav>
</template>
