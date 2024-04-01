<script setup lang="ts">
const searchVisible = ref(false);
</script>

<template>
  <header class="h-16 min-w-80 w-full bg-surface/50 backdrop-blur-xl sm:h-24">
    <div
      class="relative mx-auto box-border h-full max-w-336 w-full flex items-center gap-4 px-4 sm:px-8"
    >
        <BaseButton
          class="shrink-0 md:hidden sm:h-12 sm:min-w-12"
          :class="{
            '!hidden': searchVisible,
          }"
          density="compact"
          spread="none"
          variant="transparent" 
        >
          <div class="i-cooky:hamburger h-6 w-6" />
        </BaseButton>
        <BaseButton
          class="shrink-0 md:hidden sm:h-12 sm:min-w-12"
          :class="{
            '!hidden': !searchVisible,
          }"
          density="compact" 
          spread="none"
          variant="transparent"
          @click="searchVisible = false" 
        >
          <div class="i-material-symbols:arrow-back-rounded h-6 w-6" />
        </BaseButton>
        <h1
          class="absolute left-16 my-0 inline text-4xl sm:left-24 md:hidden"
          :class="{
            '!hidden': searchVisible,
          }" 
        >
          COOKY
        </h1>
        <div class="flex grow">
          <SearchField
            class="grow !md:flex"
            :class="{
              '!hidden': !searchVisible,
            }"
          />
          <div
            class="flex grow justify-end md:hidden"
            :class="{
              '!hidden': searchVisible,
            }"
          >
            <BaseButton class="shrink-0 !px-4" @click="searchVisible = true">
              <div class="i-cooky:search h-6 w-6" />
            </BaseButton>
          </div>
        </div>
        <BaseButton class="shrink-0 !hidden !px-4 md:!flex" variant="secondary">
          <div class="i-fad:random-1dice h-6 w-6 scale-[1.25]" />
        </BaseButton>
        <BaseButton class="shrink-0 !hidden md:!flex">New recipe</BaseButton>
        <BaseButton
          class="relative shrink-0 sm:h-12 sm:min-w-12" 
          :class="{
            '!hidden': searchVisible,
          }"
          density="compact"
          spread="none"
          variant="transparent"
        >
          <div class="i-cooky:notification h-6 w-6 text-on-surface" />
          <div
            class="absolute right-1 top-1 h-2 w-2 rounded-full bg-secondary sm:right-3 sm:top-3"
          />
        </BaseButton>
        <PictureFrame
          borderless
          class="w-8 shrink-0 cursor-pointer sm:w-12 hover:active:scale-[0.97]"
          :class="{
            '!hidden': searchVisible,
          }"
          src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2022/08/Untitled-design-(24).png"
        />
      </div>
  </header>
</template>
