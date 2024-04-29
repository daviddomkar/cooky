<script setup lang="ts">
import { useNotification } from "@kyvg/vue3-notification";
import { FetchError } from "ofetch";
import type { Input, Output } from "valibot";

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

const { notify } = useNotification();
const { session } = useAuth();

const { data: roles, refresh: refreshRoles } = await useFetch("/api/roles");

const dialogRef = ref<Input<typeof RoleFormSchema> | undefined>();

const createNewRole = () => {
  dialogRef.value = {
    id: undefined,
    title: "",
    permissions: [],
  };
};

const submit = async (role: Output<typeof RoleFormSchema>) => {
  const id = dialogRef.value?.id;

  try {
    if (id) {
      await $fetch(`/api/roles/${id}`, {
        method: "PUT",
        body: role,
      });
    } else {
      await $fetch("/api/roles", {
        method: "POST",
        body: role,
      });
    }

    await refreshRoles();

    notify({
      type: "success",
      title: `Role ${role.title} ${id ? "edited" : "created"}.`,
      text: `Role has been successfully ${id ? "edited" : "created"}.`,
    });
  } catch (e) {
    if (e instanceof FetchError) {
      notify({
        type: "error",
        title: `Failed to ${id ? "edit" : "create"} role.`,
        text: e.message,
      });
      return;
    }

    notify({
      type: "error",
      title: `Failed to ${id ? "edit" : "create"} role.`,
      text: "An unknown error occurred.",
    });
  }
};

const deleteRole = async (role: { id: string; title: string }) => {
  try {
    await $fetch(`/api/roles/${role.id}`, {
      method: "DELETE",
    });

    await refreshRoles();

    notify({
      type: "success",
      title: `Role ${role.title} deleted.`,
      text: "Role has been successfully deleted.",
    });
  } catch (e) {
    if (e instanceof FetchError) {
      notify({
        type: "error",
        title: "Failed to delete role.",
        text: e.message,
      });
      return;
    }

    notify({
      type: "error",
      title: "Failed to delete role.",
      text: "An unknown error occurred.",
    });
  }
};
</script>

<template>
  <main
    class="mx-auto box-border max-w-336 w-full flex flex-col gap-8 px-4 py-4 sm:px-8 sm:py-8"
  >
    <div class="flex flex-col items-center gap-4 lg:flex-row">
      <h1 class="my-0 grow text-center text-5xl lg:text-left">Roles</h1>
      <RoleFormDialog v-model="dialogRef" :on-submit="submit" />
      <BaseButton
        v-if="session?.user?.permissions.includes(permissions.UnitsCreate)"
        @click="createNewRole"
      >
        Add Role
      </BaseButton>
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
        <div class="py-1">{{ item.permissions.join(", ") }}</div>
      </template>
      <template #item[createdAt]="{ item }">
        {{ new Date(item.createdAt).toLocaleString() }}
      </template>
      <template #item[updatedAt]="{ item }">
        {{ new Date(item.updatedAt).toLocaleString() }}
      </template>
      <template #item[trailing]="{ item }">
        <div class="box-border flex justify-end gap-2 py-1 pr-1">
          <BaseButton
            v-if="session?.user?.permissions.includes(permissions.RolesUpdate)"
            spread="compact"
            variant="secondary"
            @click="dialogRef = item"
          >
            <div class="i-material-symbols:edit h-6 w-6" />
          </BaseButton>
          <ConfirmationDialog
            v-if="session?.user?.permissions.includes(permissions.RolesDelete)"
            :on-confirm="() => deleteRole(item)"
            :reason="`Role ${item.title} will be deleted.`"
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
