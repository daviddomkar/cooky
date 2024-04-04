<script setup lang="ts">
  const route = useRoute();
  const { username, slug } = route.params;
  const { data } = await useFetch(`/api/profile/${username}`);
  const recipeData = data.value?.recipes.find(x => x.slug === slug);

</script>

<template>
  <div>
    <div class="header flex">
      <img :src="`/api/files/${recipeData?.imageId}`"/>
    </div>
    <div class="body">
      {{ route.params }}
      {{ slug }}
      {{ data }}
    </div>
  </div>
</template>
