<script setup lang="ts">
  const route = useRoute();
  const { username, slug } = route.params;
  const { data: userData } = await useFetch(`/api/profile/${username}`);
  const { data: recipeData } = await useFetch(`/api/recipes/${username}/${slug}`);

  console.log(recipeData.value);

  const processInterval = (x: string) => x
          .split(":")
          .map((x) => Number(x))
          .map((x, i) => (x === 0 ? "" : `${x}${["h", "m", "s"][i]}`))
          .join("");

</script>

<template>
   <main
    v-if="recipeData && userData"
    class="m-auto min-h-[calc(100vh-96px)] w-full flex flex-col justify-center py-24"
  >
    <div class="header flex flex-col p-5 sm:flex-row">
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
            {{ processInterval(recipeData.preparitionDuration) }}
          </li>
          <li class="flex flex-row items-center">
            <span class="mr-3 text-xl font-bold font-display">NUTRITION / SERV</span>
            {{ recipeData.nutritionPerServing }} kcal
          </li>
        </ul>
      </div>
    </div>
    <div class="body flex flex-col items-start sm:flex-row">
      <div class="ingredients mx-5">
        <div class="title flex flex-row items-center">
          <h2 class="mr-3">INGREDIENTS</h2>
          <h3 class="mr-3">SERV</h3>
          {{ recipeData.numberOfServings }}
        </div>
        <ul class="list-none p-0">
        <li v-for="(ingredient, i) in recipeData.ingredients" :key="i" class="mb-3">
          {{ ingredient.amount }} {{ ingredient.unit.abbreviation }} {{ ingredient.ingredient.title }}
        </li>
      </ul>
      </div>
      <div class="steps mx-5 flex flex-col">
        <h2>STEPS</h2>
        <ol class="p-0 pl-5">
          <li v-for="(step, i) in recipeData.steps" :key="i" class="mb-3">
            {{ step.content }}
          </li>
        </ol>
      </div>
    </div>
  </main>
</template>
