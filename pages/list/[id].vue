<script setup lang="ts">
const route = useRoute();

const { data: list } = useFetch(`/api/lists/${route.params.id}`);
</script>

<template>
  <div>{{ list }}</div>
</template>
