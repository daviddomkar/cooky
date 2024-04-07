<script setup lang="ts">
  const route = useRoute();
  const { username, slug } = route.params;
  const { data: userData } = await useFetch(`/api/profile/${username}`);
  const { data: recipeData } = await useFetch(`/api/recipes/${username}/${slug}`);

  console.log(recipeData.value);

</script>

<template>
   <main
    v-if="recipeData && userData"
    class="m-auto min-h-[calc(100vh-96px)] w-full flex flex-col justify-center py-24"
  >
    <div class="header flex flex-row p-5">
      <RecipeImage class="flex-shrink-0" :image-id="recipeData.imageId" />
      <div class="info flex flex-col justify-start p-5">
        <div class="info-header flex flex-col">
          <div class="flex flex-row items-center">
            <PictureFrame
              borderless
              class="mr-3 w-5 shrink-0 cursor-pointer sm:w-8"
              :src="getProfileImageUrl(userData.username, userData.profileImageId)"
            /> {{ userData?.username }}
          </div>
          <div class="flex flex-row items-center text-3xl font-display">
            <!-- GET RATING -->
            <h2>{{ recipeData.title }}</h2><div>4,5/5</div>
          </div>
        </div>
        <p class="description">
          {{ recipeData.description }}
        </p>
        <ul class="p-0">
          <li class="flex flex-row items-center">
            <span class="mr-3 text-xl font-bold font-display">PREP TIME</span>
            <!-- GET PREP DURATION -->
            40 minutes
          </li>
          <li class="flex flex-row items-center">
            <span class="mr-3 text-xl font-bold font-display">NUTRITION / SERV</span>
            {{ recipeData.nutritionPerServing }} kcal
          </li>
        </ul>
      </div>
    </div>
    <div class="body">
    </div>
  </main>
</template>
