<script setup lang="ts">
const props = defineProps<{
  reason: string;
  onConfirm?: () => Promise<void>;
}>();

const model = defineModel<boolean>();

const loading = ref(false);

const confirm = async () => {
  try {
    loading.value = true;
    await props.onConfirm?.();
  } finally {
    loading.value = false;
    model.value = false;
  }
};
</script>

<template>
  <BaseDialog v-model="model" title="Are you sure?">
    <template #activator>
      <slot name="activator" :open="() => (model = true)" />
    </template>
    <p>{{ props.reason }}</p>
    <div class="flex flex-row-reverse gap-2">
      <BaseButton class="w-full" :loading="loading" @click="confirm">
        Confirm
      </BaseButton>
      <BaseButton
        class="w-full"
        :disabled="loading"
        variant="danger"
        @click="model = false"
      >
        Cancel
      </BaseButton>
    </div>
  </BaseDialog>
</template>
