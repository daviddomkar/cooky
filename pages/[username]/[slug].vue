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
    class="m-auto min-h-[calc(100vh-96px)] w-full flex flex-col justify-center gap-8 py-24"
  >
    <div class="header flex flex-col gap-8 px-4 sm:flex-row sm:px-8">
      <RecipeImage class="flex-shrink-0" :image-id="recipeData.imageId" />
      <div class="info flex flex-col justify-start">
        <div class="info-header flex flex-col">
          <div class="flex flex-row items-center gap-3">
            <PictureFrame
              borderless
              class="w-5 shrink-0 cursor-pointer sm:w-8"
              :src="getProfileImageUrl(userData.username, userData.profileImageId)"
            /> {{ userData?.username }}
          </div>
          <div class="flex flex-row flex-wrap items-center text-3xl font-display">
            <h2>{{ recipeData.title }}</h2>
            <div>
              <RecipeStars :count="recipeData.rating" />
            </div>
          </div>
        </div>
        <p class="description">
          {{ recipeData.description }}
        </p>
        <ul class="p-0">
          <li class="flex flex-row items-center gap-3">
            <span class="text-xl font-bold font-display">PREP TIME</span>
            {{ processInterval(recipeData.preparitionDuration) }}
          </li>
          <li class="flex flex-row items-center gap-3">
            <span class="text-xl font-bold font-display">NUTRITION / SERV</span>
            {{ recipeData.nutritionPerServing }} kcal
          </li>
        </ul>
      </div>
    </div>
    <div class="body flex flex-col items-start gap-8 px-4 sm:flex-row sm:px-8">
      <div class="ingredients">
        <div class="title flex flex-row items-center gap-3">
          <h2>INGREDIENTS</h2>
          <h3 >SERV</h3>
          {{ recipeData.numberOfServings }}
        </div>
        <ul class="list-none p-0">
        <li v-for="(ingredient, i) in recipeData.ingredients" :key="i" class="mb-3">
          {{ ingredient.amount }} {{ ingredient.unit.abbreviation }} {{ ingredient.ingredient.title }}
        </li>
      </ul>
      </div>
      <div class="steps flex flex-col">
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
