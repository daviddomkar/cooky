<script setup lang="ts">
definePageMeta({
  middleware: () => {
    const { session } = useAuth();

    if (
      !session.value ||
      !session.value.user.permissions.includes(permissions.RolesList)
    ) {
      abortNavigation();
    }
  },
});

const { data: roles } = await useFetch("/api/roles");
</script>

<template>
  <main
    class="mx-auto box-border max-w-336 w-full flex flex-col gap-8 px-4 py-4 sm:px-8 sm:py-8"
  >
    <div class="flex flex-col items-center gap-4 lg:flex-row">
      <h1 class="my-0 grow text-center text-5xl lg:text-left">Roles</h1>
      <BaseButton>Add Role</BaseButton>
    </div>

    <BaseTable
      :headers="[
        {
          key: 'id',
          title: 'ID',
          width: '400px',
        },
        {
          key: 'title',
          title: 'Title',
        },
        {
          key: 'permissions',
          title: 'Permissions',
        },
        {
          key: 'createdAt',
          title: 'Created at',
          width: '210px',
        },
        {
          key: 'updatedAt',
          title: 'Updated at',
          width: '210px',
        },
      ]"
      item-key="id"
      :items="roles!"
      :trailing="{
        title: 'Actions',
      }"
    >
      <template #item[permissions]="{ item }">
        <div class="py-1">{{ item.permissions.join(" ") }}</div>
      </template>
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
