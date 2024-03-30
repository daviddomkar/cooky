<template>
  <header class="h-24 w-full bg-surface">
    <div
      class="mx-auto box-border h-full max-w-7xl w-full flex items-center gap-12 px-12"
    >
      <SearchField class="grow" />
      <div class="flex items-center gap-6">
        <a class="cursor-pointer uppercase">Random recipe</a>
        <BaseButton>New recipe</BaseButton>
      </div>
      <div class="flex items-center gap-6">
        <div class="relative cursor-pointer">
          <div class="i-cooky:notification h-6 w-6 text-on-surface" />
          <div
            class="absolute right-0 top-0 h-2 w-2 rounded-full bg-secondary"
          />
        </div>
        <PictureFrame
          borderless
          class="cursor-pointer"
          :diameter="40"
          src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2022/08/Untitled-design-(24).png"
        />
      </div>
    </div>
  </header>
</template>
