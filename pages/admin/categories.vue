<script setup lang="ts">
import { useNotification } from "@kyvg/vue3-notification";
import { FetchError } from "ofetch";
import type { Input, Output } from "valibot";

definePageMeta({
  middleware: () => {
    const { session } = useAuth();

    if (
      !session.value ||
      !session.value.user.permissions.includes(permissions.CategoriesList)
    ) {
      abortNavigation();
    }
  },
});

const { notify } = useNotification();
const { session } = useAuth();

const { data: categories, refresh: refreshCategories } =
  await useFetch("/api/categories");

const dialogRef = ref<Input<typeof CategoryFormSchema> | undefined>();

const createNewCategory = () => {
  dialogRef.value = {
    id: undefined,
    title: "",
    slug: "",
    icon: "",
  };
};

const submit = async (category: Output<typeof CategoryFormSchema>) => {
  const id = dialogRef.value?.id;

  try {
    if (id) {
      await $fetch(`/api/categories/${id}`, {
        method: "PUT",
        body: category,
      });
    } else {
      await $fetch("/api/categories", {
        method: "POST",
        body: category,
      });
    }

    await refreshCategories();

    notify({
      type: "success",
      title: `Category ${category.title} ${id ? "edited" : "created"}.`,
      text: `Category has been successfully ${id ? "edited" : "created"}.`,
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

const deleteCategory = async (category: { id: string; title: string }) => {
  try {
    await $fetch(`/api/categories/${category.id}`, {
      method: "DELETE",
    });

    await refreshCategories();

    notify({
      type: "success",
      title: `Category ${category.title} deleted.`,
      text: "Category has been successfully deleted.",
    });
  } catch (e) {
    if (e instanceof FetchError) {
      notify({
        type: "error",
        title: "Failed to delete category.",
        text: e.message,
      });
      return;
    }

    notify({
      type: "error",
      title: "Failed to delete category.",
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
      <h1 class="my-0 grow text-center text-5xl lg:text-left">Categories</h1>
      <CategoryFormDialog v-model="dialogRef" :on-submit="submit" />
      <BaseButton @click="createNewCategory">Add Category</BaseButton>
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
          key: 'slug',
          title: 'Slug',
        },
        {
          key: 'icon',
          title: 'Icon',
          width: '64px',
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
      :items="categories!"
      :trailing="
        session?.user?.permissions.includes(permissions.CategoriesUpdate) ||
        session?.user?.permissions.includes(permissions.CategoriesDelete)
          ? {
              title: 'Actions',
            }
          : undefined
      "
    >
      <template #item[icon]="{ item }">
        <div :class="`i-cooky:${item.icon}`" />
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
            v-if="
              session?.user?.permissions.includes(permissions.CategoriesUpdate)
            "
            spread="compact"
            variant="secondary"
            @click="dialogRef = item"
          >
            <div class="i-material-symbols:edit h-6 w-6" />
          </BaseButton>
          <ConfirmationDialog
            v-if="
              session?.user?.permissions.includes(permissions.CategoriesDelete)
            "
            :on-confirm="() => deleteCategory(item)"
            :reason="`Category ${item.title} will be deleted.`"
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
