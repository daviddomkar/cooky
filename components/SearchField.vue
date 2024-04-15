<template>
  <div class="relative box-border h-12 flex">
    <TextField label="SEARCH" name="search">
      <template #trailing>
        <BaseButton class="mr-0.75 md:!px-8" spread="compact">
          <div class="i-cooky:search h-6 w-6" />
        </BaseButton>
      </template>
    </TextField>
  </div>
</template>
