<script setup lang="ts">
import { blob, maxSize, mimeType, object } from "valibot";

const { session, status, signOut } = useAuth();

const { handleSubmit, isSubmitting, handleReset } = useForm({
  validationSchema: toTypedSchema(
    object({
      profileImage: blob("This field is required", [
        mimeType(
          ["image/jpeg", "image/png", "image/gif"],
          "The file must be an image (jpeg, png or gif)",
        ),
        maxSize(5 * 1024 * 1024, "The file size must be less than 5MB"),
      ]),
    }),
  ),
});

const { value, errorMessage, handleChange, handleBlur } = useField(
  "profileImage",
  undefined,
  {
    validateOnValueUpdate: false,
    syncVModel: true,
  },
);

const submit = handleSubmit(async (values, _) => {
  const formData = new FormData();

  formData.append("profileImage", values.profileImage);

  await $fetch(`/api/profile`, {
    method: "PATCH",
    body: formData,
  });
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <div>Auth Status: {{ status }}</div>
    <div v-if="status === 'authenticated'" class="flex flex-col gap-6">
      <div>Session: {{ session?.user }}</div>
      <BaseButton @click="signOut">Sign Out</BaseButton>
    </div>
    <div v-else class="flex gap-6">
      <NuxtLink class="cursor-pointer text-primary underline" to="/auth/signup">
        Sign Up
      </NuxtLink>
      <NuxtLink class="cursor-pointer text-primary underline" to="/auth/login">
        Log In
      </NuxtLink>
    </div>
    <form @reset="handleReset" @submit="submit">
      <input
        id="profileImage"
        class="peer box-border h-12 w-full border-1 rounded-full border-solid px-6 text-on-surface outline-none transition-colors focus:border-primary/0 dark:bg-surface-container focus:outline-none focus:ring-none"
        :class="{
          'border-primary/0 outline-none ring-none': value,
          'border-outline': !value && !errorMessage,
          'border-error': errorMessage,
        }"
        name="profileImage"
        type="file"
        @blur="handleBlur"
        @change="handleChange"
      />
      <label v-if="errorMessage" class="inline-block px-6 text-xs text-error">
        {{ errorMessage }}
      </label>
      <BaseButton class="mt-2 sm:mt-4" :loading="isSubmitting" type="submit">
        Upload
      </BaseButton>
    </form>
  </div>
</template>
