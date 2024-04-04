<script setup lang="ts"></script>

<template>
  <main
    class="m-auto min-h-[calc(100vh-96px)] w-full flex flex-col justify-center py-24"
  >
    <div class="flex flex-col items-center justify-center">
      <h1 class="m-0 pb-8 text-5xl md:pb-0 md:text-8xl">Hello and Welcome</h1>
      <h2 class="m-8 hidden text-5xl md:flex">Add | Save | Rate</h2>
    </div>
    <div>
      <Vue3Marquee>
        <RecipeListCard
          v-for="n in 5"
          :key="n"
          class="mx-12 mb-12 box-border w-96"
          :cover-image-id="'b6b95954-52e7-472f-967a-b523f60affc7'"
          title="Pancakes"
        />
      </Vue3Marquee>
      <Vue3Marquee direction="reverse">
        <RecipeListCard
          v-for="n in 5"
          :key="n"
          class="mx-12 mb-12 box-border w-96"
          :cover-image-id="'b6b95954-52e7-472f-967a-b523f60affc7'"
          title="Pancakes"
        />
      </Vue3Marquee>
      <Vue3Marquee class="visible md:invisible">
        <RecipeListCard
          v-for="n in 5"
          :key="n"
          class="mx-12 box-border w-96"
          :cover-image-id="'b6b95954-52e7-472f-967a-b523f60affc7'"
          title="Pancakes"
        />
      </Vue3Marquee>
    </div>
    <div class="flex items-center justify-center md:hidden">
      <h2 class="m-8 text-5xl">Add | Save | Rate</h2>
    </div>
  </main>
</template>
