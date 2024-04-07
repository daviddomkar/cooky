<script setup lang="ts">
  const route = useRoute();
  const { username, slug } = route.params;
  const { data: userData } = await useFetch(`/api/profile/${username}`);
  const { data: recipeData } = await useFetch(`/api/recipes/${username}/${slug}`);

</script>

<template>
   <main
    v-if="recipeData && userData"
    class="m-auto min-h-[calc(100vh-96px)] w-full flex flex-col justify-center py-24"
  >
    <div class="header flex flex-row p-5">
      <RecipeImage class="flex-shrink-0" :image-id="recipeData.imageId" />
      <div class="info flex flex-col p-5">
        <div class="info-header flex flex-col">
          <div class="flex flex-row items-center"> <PictureFrame
            borderless
            class="w-8 shrink-0 cursor-pointer sm:w-12"
            :src="getProfileImageUrl(userData.username, userData.profileImageId)"
          /> {{ userData?.username }}
          </div>
          <div class="flex flex-row items-center font-size-7 font-display">
            <h2>{{ recipeData.title }}</h2><div>4,5/5</div>
          </div>
        </div>
        <div class="description">
            <p>
              {{ recipeData.description }}
            </p>
            {{ recipeData }}
          </div>
      </div>
    </div>
    <div class="body">
    </div>
  </main>
</template>
