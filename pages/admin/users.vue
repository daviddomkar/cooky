<script setup lang="ts">
definePageMeta({
  middleware: () => {
    const { session } = useAuth();

    if (
      !session.value ||
      !session.value.user.permissions.includes(permissions.UsersList)
    ) {
      abortNavigation();
    }
  },
});

const { data: users } = await useFetch("/api/users");
</script>

<template>
  <main
    class="mx-auto box-border max-w-336 w-full flex flex-col gap-8 px-4 py-4 sm:px-8 sm:py-8"
  >
    <h1 class="my-0 text-center text-5xl lg:text-left">Users</h1>
    <BaseTable
      :headers="[
        {
          key: 'id',
          title: 'ID',
          width: '400px',
        },
        {
          key: 'name',
          title: 'Name',
        },
        {
          key: 'username',
          title: 'Username',
        },
        {
          key: 'email',
          title: 'Email',
        },
      ]"
      item-key="id"
      :items="users!"
      :trailing="{
        title: 'Actions',
      }"
    >
      <template #item[createdAt]="{ item }">
        {{ new Date(item.createdAt).toLocaleString() }}
      </template>
      <template #item[updatedAt]="{ item }">
        {{ new Date(item.updatedAt).toLocaleString() }}
      </template>
      <template #item[trailing]>
        <div class="box-border flex justify-end gap-2 py-1 pr-1">
          <BaseButton spread="compact" variant="secondary">
            <div class="i-material-symbols:edit h-6 w-6" />
          </BaseButton>
          <BaseButton spread="compact" variant="danger">
            <div class="i-material-symbols:delete h-6 w-6" />
          </BaseButton>
        </div>
      </template>
    </BaseTable>
  </main>
</template>
