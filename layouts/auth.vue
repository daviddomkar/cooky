import AuthWelcome from '~/components/AuthWelcome.vue';
<template>
  <div class="relative min-h-screen flex items-stretch">
    <div class="relative w-full !hidden !xl:block">
      <div class="fixed h-screen w-[50%]">
        <AuthWelcome class="h-full w-full !hidden !xl:flex" />
        <div class="absolute bottom-[calc(20%_-_6rem)] hidden -right-24 xl:block">
          <PictureFrame class="w-48" src="/food_1.jpg" />
        </div>
      </div>
    </div>
    <div class="relative w-full flex flex-col justify-center overflow-hidden">
      <div class="relative min-h-200 flex flex-col justify-center">
        <div class="absolute left-[calc(48%_-_12rem)] -top-96">
          <PictureFrame class="w-96" src="/food_0.jpg" />
        </div>
        <slot />
        <div class="absolute -bottom-112 -right-32">
          <PictureFrame class="w-112" src="/food_2.jpg" />
        </div>
      </div>
    </div>
  </div>
</template>
