<script setup lang="ts">
import { useNotification } from "@kyvg/vue3-notification";
import { FetchError } from "ofetch";
import type { Input, Output } from "valibot";

definePageMeta({
  middleware: () => {
    const { session } = useAuth();

    if (
      !session.value ||
      !session.value.user.permissions.includes(permissions.UnitsList)
    ) {
      abortNavigation();
    }
  },
});

const { notify } = useNotification();
const { session } = useAuth();

const { data: units, refresh: refreshUnits } = await useFetch("/api/units");

const dialogRef = ref<Input<typeof UnitFormSchema> | undefined>();

const createNewUnit = () => {
  dialogRef.value = {
    id: undefined,
    title: "",
    type: undefined as any,
    abbreviation: "",
  };
};

const submit = async (unit: Output<typeof UnitFormSchema>) => {
  const id = dialogRef.value?.id;

  try {
    if (id) {
      await $fetch(`/api/units/${id}`, {
        method: "PUT",
        body: unit,
      });
    } else {
      await $fetch("/api/units", {
        method: "POST",
        body: unit,
      });
    }

    await refreshUnits();

    notify({
      type: "success",
      title: `Unit ${unit.title} ${id ? "edited" : "created"}.`,
      text: `Unit has been successfully ${id ? "edited" : "created"}.`,
    });
  } catch (e) {
    if (e instanceof FetchError) {
      notify({
        type: "error",
        title: `Failed to ${id ? "edit" : "create"} category.`,
        text: e.message,
      });
      return;
    }

    notify({
      type: "error",
      title: `Failed to ${id ? "edit" : "create"} category.`,
      text: "An unknown error occurred.",
    });
  }
};

const deleteUnit = async (unit: { id: string; title: string }) => {
  try {
    await $fetch(`/api/units/${unit.id}`, {
      method: "DELETE",
    });

    await refreshUnits();

    notify({
      type: "success",
      title: `Unit ${unit.title} deleted.`,
      text: "Unit has been successfully deleted.",
    });
  } catch (e) {
    if (e instanceof FetchError) {
      notify({
        type: "error",
        title: "Failed to delete unit.",
        text: e.message,
      });
      return;
    }

    notify({
      type: "error",
      title: "Failed to delete unit.",
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
      <h1 class="my-0 grow text-center text-5xl lg:text-left">Units</h1>
      <UnitFormDialog v-model="dialogRef" :on-submit="submit" />
      <BaseButton
        v-if="session?.user?.permissions.includes(permissions.UnitsCreate)"
        @click="createNewUnit"
      >
        Add Unit
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
          key: 'type',
          title: 'Type',
        },
        {
          key: 'abbreviation',
          title: 'Abbreviation',
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
      :items="units!"
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
          <BaseButton
            v-if="session?.user?.permissions.includes(permissions.UnitsUpdate)"
            spread="compact"
            variant="secondary"
            @click="dialogRef = item"
          >
            <div class="i-material-symbols:edit h-6 w-6" />
          </BaseButton>
          <ConfirmationDialog
            v-if="session?.user?.permissions.includes(permissions.UnitsDelete)"
            :on-confirm="() => deleteUnit(item)"
            :reason="`Unit ${item.title} will be deleted.`"
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
