<script setup lang="ts">
const route = useRoute();

const { session } = useAuth();

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
    <div class="mx-auto box-border max-w-320 w-full flex gap-8 px-8">
      <div>
        <ProfileImageFrame
          class="relative -mt-[96px]"
          :editable="session?.user.username === profile?.username"
          :on-new-profile-image="saveProfileImage"
          :profile-image-id="profile?.profileImageId"
          :username="profile!.username"
        />
      </div>
      <div class="box-border flex grow flex-col gap-4 pt-7">
        <div>
          <p class="my-0 text-base text-primary"> @{{ profile?.username }}</p>
          <h1 class="my-0 text-6xl">{{ profile?.name }}</h1>
        </div>
      </div>
    </div>
  </div>
</template>
