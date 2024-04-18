<script setup lang="ts">
const route = useRoute();
const { username, slug } = route.params;
const { data: userData } = await useFetch(`/api/profile/${username}`);
const { data: recipeData } = await useFetch(`/api/recipes/${username}/${slug}`);

const processInterval = (x: string) =>
  x
    .split(":")
    .map((x) => Number(x))
    .map((x, i) => (x === 0 ? "" : `${x}${["h", "m", "s"][i]}`))
    .join("");

const printPage = () => {
  window.scrollTo(0, 0);
  window.print();
};
const handleListSave = (data: any) => {
  console.log("listsave", data);
};
</script>

<template>
  <main
    v-if="recipeData"
    class="m-auto min-h-[calc(100vh-96px)] w-full flex flex-col justify-center gap-8 py-24"
  >
    <div class="header flex flex-col gap-8 px-4 sm:flex-row sm:px-8">
      <RecipeImage class="flex-shrink-0" :image-id="recipeData.imageId" />
      <div class="info flex flex-col justify-start">
        <div class="info-header flex flex-col">
          <div v-if="userData" class="flex flex-row items-center gap-3">
            <PictureFrame
              borderless
              class="w-5 shrink-0 cursor-pointer sm:w-8"
              :src="
                getProfileImageUrl(userData.username, userData.profileImageId)
              "
            />
            {{ userData?.username }}
          </div>
          <div
            class="flex flex-row flex-wrap items-center gap-3 text-3xl font-display"
          >
            <h2>{{ recipeData.title }}</h2>
            <div>
              <RecipeStars
                :model-value="recipeData.rating ?? undefined"
                variant="display"
              />
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
        <div
          class="options mt-auto flex flex-row items-center justify-end gap-3 print:hidden"
        >
          <BaseButton spread="compact" variant="secondary" @click="printPage">
            <template #icon>
              <div class="i-cooky:print" />
            </template>
          </BaseButton>
          <RecipeFavoriteButton
            v-if="userData"
            :lists="userData.lists"
            @submit="handleListSave"
          />
        </div>
      </div>
    </div>
    <div class="body flex flex-col items-start gap-8 px-4 sm:flex-row sm:px-8">
      <div class="ingredients flex flex-col sm:flex-shrink-0">
        <div class="title flex flex-row items-center gap-3">
          <h2>INGREDIENTS</h2>
          <h3>SERV</h3>
          {{ recipeData.numberOfServings }}
        </div>
        <ul class="list-none p-0">
          <li
            v-for="(ingredient, i) in recipeData.ingredients"
            :key="i"
            class="mb-3"
          >
            {{ ingredient.amount }} {{ ingredient.unit.abbreviation }}
            {{ ingredient.ingredient.title }}
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
    <div class="footer px-4 print:hidden">
      <div v-if="userData" class="review">
        <CommentTextField
          expanded
          :profile-image-id="userData.profileImageId"
          :username="userData.username"
        />
      </div>
      <ul class="list-none">
        <li v-for="comment in recipeData.comments" :key="comment.id">
          <RecipeComment
            :author-image-id="comment.author.profileImageId"
            :author-name="comment.author.username"
            class="mb-3"
            :content="comment.content"
            :created-at="comment.createdAt"
          />
          <ul class="list-none">
            <li v-for="reply in comment.replies" :key="reply.id">
              <RecipeComment
                :author-image-id="reply.author.profileImageId"
                :author-name="reply.author.username"
                class="mb-3"
                :content="reply.content"
                :created-at="reply.createdAt"
              />
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </main>
  <main v-else class="w-full flex flex-col justify-center py-24">
    <h2 class="text-center">Recipe {{ `${username}/${slug}` }} not found.</h2>
  </main>
</template>
