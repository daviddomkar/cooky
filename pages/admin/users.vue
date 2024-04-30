<script setup lang="ts">
import { useNotification } from "@kyvg/vue3-notification";
import { FetchError } from "ofetch";
import type { Input, Output } from "valibot";

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

const { notify } = useNotification();
const { session } = useAuth();

const { data: users, refresh: refreshUsers } = await useFetch("/api/users");
const { data: roles } = await useFetch("/api/roles");

const dialogRef = ref<Input<typeof UserFormSchema> | undefined>();

const submit = async (user: Output<typeof UserFormSchema>) => {
  const id = dialogRef.value?.id;

  try {
    if (id) {
      await $fetch(`/api/users/${id}`, {
        method: "PUT",
        body: user,
      });
    } else {
      // User creation is only available trough sign up but in the future
      // we might decide to have it in admin as well
      /* await $fetch("/api/users", {
        method: "POST",
        body: user,
      }); */
    }

    await refreshUsers();

    notify({
      type: "success",
      title: `User ${user.name} ${id ? "edited" : "created"}.`,
      text: `User has been successfully ${id ? "edited" : "created"}.`,
    });
  } catch (e) {
    if (e instanceof FetchError) {
      notify({
        type: "error",
        title: `Failed to ${id ? "edit" : "create"} user.`,
        text: e.message,
      });
      return;
    }

    notify({
      type: "error",
      title: `Failed to ${id ? "edit" : "create"} user.`,
      text: "An unknown error occurred.",
    });
  }
};

const deleteUser = async (user: { id: string; name: string }) => {
  try {
    await $fetch(`/api/users/${user.id}`, {
      method: "DELETE",
    });

    await refreshUsers();

    notify({
      type: "success",
      title: `User ${user.name} deleted.`,
      text: "User has been successfully deleted.",
    });
  } catch (e) {
    if (e instanceof FetchError) {
      notify({
        type: "error",
        title: "Failed to delete user.",
        text: e.message,
      });
      return;
    }

    notify({
      type: "error",
      title: "Failed to delete user.",
      text: "An unknown error occurred.",
    });
  }
};
</script>

<template>
  <main
    class="mx-auto box-border max-w-336 w-full flex flex-col gap-8 px-4 py-4 sm:px-8 sm:py-8"
  >
    <h1 class="my-0 text-center text-5xl lg:text-left">Users</h1>
    <UserFormDialog v-model="dialogRef" :on-submit="submit" :roles="roles!" />
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
      <template #item[trailing]="{ item }">
        <div class="box-border flex justify-end gap-2 py-1 pr-1">
          <p
            v-if="session?.user.id === item.id"
            class="my-0 py-2 pr-5 text-outline"
          >
            Forbidden
          </p>
          <BaseButton
            v-if="
              session?.user?.permissions.includes(permissions.UsersUpdate) &&
              session.user.id !== item.id
            "
            spread="compact"
            variant="secondary"
            @click="
              dialogRef = {
                ...item,
                roles: item.roles.map((role) => role.id),
              }
            "
          >
            <div class="i-material-symbols:edit h-6 w-6" />
          </BaseButton>
          <ConfirmationDialog
            v-if="
              session?.user?.permissions.includes(permissions.UsersDelete) &&
              session.user.id !== item.id
            "
            :on-confirm="() => deleteUser(item)"
            :reason="`User ${item.name} will be deleted.`"
          >
            <template #activator="{ open }">
              <BaseButton spread="compact" variant="danger" @click="open">
                <div class="i-material-symbols:delete h-6 w-6" />
              </BaseButton>
            </template>
          </ConfirmationDialog>
        </div>
      </template>
    </BaseTable>
  </main>
</template>
