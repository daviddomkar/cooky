<script setup lang="ts">
const route = useRoute();

const { session } = useAuth();

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
};

const saveCoverImage = async (blob: Blob) => {
  const formData = new FormData();
  formData.append("coverImage", blob);

  await $fetch(`/api/profile/${profile.value?.username}`, {
    method: "PATCH",
    body: formData,
  });

  await refresh();
};
</script>

<template>
  <div>
    <ProfileCoverImageHeader
      :cover-image-id="profile?.coverImageId"
      :editable="session?.user.username === profile?.username"
      :on-new-cover-image="saveCoverImage"
    />
    <div class="mx-auto box-border max-w-336 w-full flex gap-8 px-8">
      <div>
        <ProfileImageFrame
          class="relative -mt-[96px]"
          :editable="session?.user.username === profile?.username"
          :on-new-profile-image="saveProfileImage"
          :profile-image-id="profile?.profileImageId"
          :username="profile!.username"
        />
      </div>
      <div class="box-border flex grow flex-col py-4">
        <div class="mb-4">
          <p class="my-0 text-base text-primary"> @{{ profile?.username }}</p>
          <h1 class="my-0 text-[4rem]">{{ profile?.name }}</h1>
        </div>
        <div v-if="profile!.lists.length > 0" class="mb-8 flex flex-col">
          <h2 class="my-0 text-[2rem]">Lists</h2>
          <div class="grid grid-cols-[repeat(auto-fit,_minmax(320px,_auto))] gap-4">
            <NuxtLink v-for="list in profile!.lists" :key="list.id" class="block" :to="`/list/${list.id}`">
              <RecipeListCard :cover-image-id="list.imageId" :title="list.title" />
            </NuxtLink>
            <!-- Add empty divs to fill the grid when the amount of lists is low -->
            <div v-if="profile!.lists.length < 2" />
            <div v-if="profile!.lists.length < 3" />
          </div>
        </div>
        <div v-if="profile!.recipes.length > 0" class="flex flex-col">
          <h2 class="my-0 text-[2rem]">Recipes</h2>
          <MasonryWall :column-width="320" :gap="16" :items="profile!.recipes" :max-columns="3" :ssr-columns="isMobile ? 1 : 3">
            <template #default="{ item }">
              <NuxtLink class="block" :to="`/${profile!.username}/${item.slug}`">
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
    </div>
  </div>
</template>
