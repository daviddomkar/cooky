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
      <template #body="{ item, close }">
        <BaseNotification
          :content="item.text!"
          :title="item.title!"
          :type="(item as any).type"
          @close="close"
        />
      </template>
    </Notifications>
  </div>
</template>
