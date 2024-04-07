<script setup lang="ts">
import { Notifications } from "@kyvg/vue3-notification";

provideHeadlessUseId(() => useId());
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Notifications position="bottom right">
      <template #body="props">
        <div class="my-notification">
          <p class="title">
            {{ props.item.title }}
          </p>
          <button class="close" @click="props.close"> Close </button>
          <p>{{ props.item.text }}</p>
        </div>
      </template>
    </Notifications>
  </div>
</template>
