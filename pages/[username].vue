<script setup lang="ts">
import type { Session } from "@auth/core/types";
import { useNotification } from "@kyvg/vue3-notification";
import { FetchError } from "ofetch";

const route = useRoute();

const { notify } = useNotification();

const { session, updateSession } = useAuth();

const { data: profile, refresh } = await useFetch(
  `/api/profile/${route.params.username}`,
);

const saveProfileImage = async (blob: Blob) => {
  const formData = new FormData();
  formData.append("profileImage", blob);

  try {
    await $fetch(`/api/profile/${profile.value?.username}`, {
      method: "PATCH",
      body: formData,
    });

    await refresh();

    const refreshedSession = await $fetch<Session>(`/api/auth/session`);

    updateSession(refreshedSession);
  } catch (e) {
    if (e instanceof FetchError) {
      notify({
        type: "error",
        title: "Failed to save profile image.",
        text: e.message,
      });
      return;
    }

    notify({
      type: "error",
      title: "Failed to save profile image.",
      text: "An unknown error occurred.",
    });
  }
};

const saveCoverImage = async (blob: Blob) => {
  const formData = new FormData();
  formData.append("coverImage", blob);

  try {
    await $fetch(`/api/profile/${profile.value?.username}`, {
      method: "PATCH",
      body: formData,
    });

    await refresh();

    const refreshedSession = await $fetch<Session>(`/api/auth/session`);

    updateSession(refreshedSession);
  } catch (e) {
    if (e instanceof FetchError) {
      notify({
        type: "error",
        title: "Failed to save cover photo.",
        text: e.message,
      });
      return;
    }

    notify({
      type: "error",
      title: "Failed to save cover photo.",
      text: "An unknown error occurred.",
    });
  }
};
</script>

<template>
  <main>
    <ProfileCoverImageHeader
      :cover-image-id="profile?.coverImageId"
      :editable="session?.user.username === profile?.username"
      :on-new-cover-image="saveCoverImage"
    />
    <div
      class="mx-auto box-border max-w-336 w-full flex flex-col gap-8 px-4 pb-4 sm:px-8 sm:pb-8"
    >
      <div
        class="mx-auto flex flex-col items-center gap-4 lg:m-0 lg:flex-row lg:items-end"
      >
        <ProfileImageFrame
          class="relative h-32 w-32 -mt-[64px] sm:h-48 sm:w-48 -sm:mt-[96px]"
          :editable="session?.user.username === profile?.username"
          :on-new-profile-image="saveProfileImage"
          :profile-image-id="profile?.profileImageId"
          :username="profile!.username"
        />
        <div class="text-center lg:text-left">
          <p class="my-0 text-base text-primary"> @{{ profile?.username }}</p>
          <h1 class="my-0 text-5xl sm:text-6xl">{{ profile?.name }}</h1>
        </div>
      </div>
      <ProfileNavBar
        :show-drafts="session?.user.username === profile?.username"
        :username="profile!.username"
      />
      <NuxtPage />
    </div>
  </main>
</template>
