<script setup lang="ts">
import { blob, maxSize, mimeType, object } from "valibot";

const route = useRoute();

const { data: profile, refresh } = await useFetch(
  `/api/profile/${route.params.username}`,
);

const { handleSubmit, isSubmitting, handleReset } = useForm({
  validationSchema: toTypedSchema(
    object({
      coverImage: blob("This field is required", [
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
  "coverImage",
  undefined,
  {
    validateOnValueUpdate: false,
  },
);

const submit = handleSubmit(async (values, { resetForm }) => {
  const formData = new FormData();

  formData.append("coverImage", values.coverImage);

  await $fetch(`/api/profile/${profile.value?.username}`, {
    method: "PATCH",
    body: formData,
  });

  await refresh();

  resetForm();
});
</script>

<template>
  <div>
    {{ profile?.username }}
    {{ profile?.name }}
    <div v-if="profile?.profileImageId">
      <img :src="`/api/files/${profile.profileImageId}`" />
    </div>
    <div v-if="profile?.coverImageId">
      <img :src="`/api/files/${profile.coverImageId}`" />
    </div>
    <form @reset="handleReset" @submit="submit">
      <input
        id="coverImage"
        class="peer box-border h-12 w-full border-1 rounded-full border-solid px-6 text-on-surface outline-none transition-colors focus:border-primary/0 dark:bg-surface-container focus:outline-none focus:ring-none"
        :class="{
          'border-primary/0 outline-none ring-none': value,
          'border-outline': !value && !errorMessage,
          '!border-error': errorMessage,
        }"
        name="coverImage"
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
