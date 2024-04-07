<script setup lang="ts">
import type { Session } from "@auth/core/types";

const route = useRoute();

const { session, updateSession } = useAuth();

const { isMobile } = useDevice();

const { data: profile, refresh } = await useFetch(
  `/api/profile/${route.params.username}`,
);

const saveProfileImage = async (blob: Blob) => {
  const formData = new FormData();
  formData.append("profileImage", blob);

  await $fetch(`/api/profile/${profile.value?.username}`, {
    method: "PATCH",
    body: formData,
  });

  await refresh();

  const refreshedSession = await $fetch<Session>(`/api/auth/session`);

  updateSession(refreshedSession);
};

const saveCoverImage = async (blob: Blob) => {
  const formData = new FormData();
  formData.append("coverImage", blob);

  await $fetch(`/api/profile/${profile.value?.username}`, {
    method: "PATCH",
    body: formData,
  });

  await refresh();

  const refreshedSession = await $fetch<Session>(`/api/auth/session`);

  updateSession(refreshedSession);
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
      <div v-if="profile!.lists.length > 0" class="flex flex-col gap-1">
        <h2
          class="my-0 text-center text-4xl text-on-surface-variant lg:text-left sm:text-5xl"
        >
          Lists
        </h2>
        <div
          class="grid grid-cols-[repeat(auto-fit,_minmax(256px,_auto))] gap-4"
        >
          <NuxtLink
            v-for="list in profile!.lists"
            :key="list.id"
            class="block transition-transform hover:active:scale-[0.97]"
            :to="`/list/${list.id}`"
          >
            <RecipeListCard
              :cover-image-id="list.imageId"
              :title="list.title"
            />
          </NuxtLink>
          <!-- Add empty divs to fill the grid when the amount of lists is low -->
          <div v-if="profile!.lists.length < 2" />
          <div v-if="profile!.lists.length < 3" />
          <div v-if="profile!.lists.length < 4" />
        </div>
      </div>
      <div v-if="profile!.recipes.length > 0" class="flex flex-col gap-1">
        <h2
          class="my-0 text-center text-4xl text-on-surface-variant lg:text-left sm:text-5xl"
        >
          Recipes
        </h2>
        <MasonryWall
          :column-width="256"
          :gap="16"
          :items="profile!.recipes"
          :max-columns="4"
          :ssr-columns="isMobile ? 1 : 4"
        >
          <template #default="{ item }">
            <NuxtLink
              class="block transition-transform hover:active:scale-[0.97]"
              :to="`/${profile!.username}/${item.slug}`"
            >
              <RecipeCard
                :key="item.id"
                :author="{
                  username: profile!.username,
                  name: profile!.name,
                  profileImageId: profile!.profileImageId,
                }"
                :cover-image-id="item.imageId"
                :title="item.title"
              />
            </NuxtLink>
          </template>
        </MasonryWall>
      </div>
    </div>
  </main>
</template>
