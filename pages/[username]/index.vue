<script setup lang="ts">
const route = useRoute();

const { session } = useAuth();

const { data: profile } = await useFetch(
  `/api/profile/${route.params.username}`,
);
/*
const { handleSubmit, isSubmitting, handleReset } = useForm({
  validationSchema: toTypedSchema(EditProfileFormSchema),
});

const {
  value: profileImageValue,
  errorMessage: profileImageErrorMessage,
  handleChange: profileImageHandleChange,
  handleBlur: profileImageHandleBlur,
  handleReset: profileImageHandleReset,
} = useField("profileImage");

const {
  value: coverImageValue,
  errorMessage: coverImageErrorMessage,
  handleChange: coverImageHandleChange,
  handleBlur: coverImageHandleBlur,
  handleReset: coverImageHandleReset,
} = useField("coverImage");

const submit = handleSubmit(async (values, { resetForm }) => {
  if ("name" in values) {
    await $fetch(`/api/profile/${profile.value?.username}`, {
      method: "PATCH",
      body: { name: values.name },
    });
  } else if ("profileImage" in values) {
    const formData = new FormData();
    formData.append("profileImage", values.profileImage);

    await $fetch(`/api/profile/${profile.value?.username}`, {
      method: "PATCH",
      body: formData,
    });
  } else if ("coverImage" in values) {
    const formData = new FormData();
    formData.append("coverImage", values.coverImage);

    await $fetch(`/api/profile/${profile.value?.username}`, {
      method: "PATCH",
      body: formData,
    });
  }

  await refresh();

  resetForm();
});
*/
</script>

<template>
  <div class="min-h-screen">
    <div
      class="relative max-h-96 flex bg-cover bg-center"
      :style="{
        'background-image': profile?.coverImageId
          ? `url(/api/files/${profile.coverImageId})`
          : 'url(https://www.homeware.cz/images/clanky/Clanky/palacinky.jpg)',
      }"
    >
      <div class="h-full w-full backdrop-blur-xl">
        <img
          v-if="profile?.coverImageId"
          class="mx-auto block max-w-320 w-full object-cover"
          :src="`/api/files/${profile.coverImageId}`"
        />
      </div>
    </div>
    <div class="mx-auto box-border max-w-320 w-full flex gap-8 px-8">
      <div>
        <PictureFrame
          class="relative -mt-[96px]"
          :diameter="192"
          :src="
            profile?.profileImageId
              ? `/api/files/${profile.profileImageId}`
              : 'https://www.homeware.cz/images/clanky/Clanky/palacinky.jpg'
          "
        >
          <ImageCropDialog
            v-if="session?.user.username === profile?.username"
            class="h-full w-full"
            title="Change profile image"
          >
            <template #activator="{ handleChange }">
              <label
                class="block h-full w-full flex cursor-pointer items-center justify-center border-none bg-black/40 opacity-0 transition-opacity hover:opacity-100"
              >
                <div class="i-material-symbols:edit text-4xl" />
                <input
                  accept="image/*"
                  hidden
                  type="file"
                  @change="handleChange"
                />
              </label>
            </template>
          </ImageCropDialog>
        </PictureFrame>
      </div>
      <div class="box-border flex grow flex-col gap-4 pt-7">
        <div>
          <p class="my-0 text-base text-primary"> @{{ profile?.username }}</p>
          <h1 class="my-0 text-6xl">{{ profile?.name }}</h1>
        </div>
      </div>
    </div>
  </div>
  <!--<div class="box-border flex flex-col">
    {{ profile?.username }}
    {{ profile?.name }}
    <div v-if="profile?.profileImageId">
      <img :src="`/api/files/${profile.profileImageId}`" />
    </div>
    <div v-if="profile?.coverImageId">
      <img :src="`/api/files/${profile.coverImageId}`" />
    </div>
    <form class="flex flex-col gap-4" @reset="handleReset" @submit="submit">
      <TextField label="Name" name="name" />
      <input
        id="profileImage"
        class="peer box-border h-12 w-full border-1 rounded-full border-solid px-6 text-on-surface outline-none transition-colors focus:border-primary/0 dark:bg-surface-container focus:outline-none focus:ring-none"
        :class="{
          'border-primary/0 outline-none ring-none': profileImageValue,
          'border-outline': !profileImageValue && !profileImageErrorMessage,
          '!border-error': profileImageErrorMessage,
        }"
        name="profileImage"
        type="file"
        @blur="profileImageHandleBlur"
        @change="profileImageHandleChange"
        @reset="profileImageHandleReset"
      />
      <label
        v-if="profileImageErrorMessage"
        class="inline-block px-6 text-xs text-error"
      >
        {{ profileImageErrorMessage }}
      </label>
      <input
        id="coverImage"
        class="peer box-border h-12 w-full border-1 rounded-full border-solid px-6 text-on-surface outline-none transition-colors focus:border-primary/0 dark:bg-surface-container focus:outline-none focus:ring-none"
        :class="{
          'border-primary/0 outline-none ring-none': coverImageValue,
          'border-outline': !coverImageValue && !coverImageErrorMessage,
          '!border-error': coverImageErrorMessage,
        }"
        name="coverImage"
        type="file"
        @blur="coverImageHandleBlur"
        @change="coverImageHandleChange"
        @reset="coverImageHandleReset"
      />
      <label
        v-if="coverImageErrorMessage"
        class="inline-block px-6 text-xs text-error"
      >
        {{ coverImageErrorMessage }}
      </label>
      <BaseButton class="mt-2 sm:mt-4" :loading="isSubmitting" type="submit">
        Upload
      </BaseButton>
    </form>
  </div>-->
</template>
