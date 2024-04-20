<script setup lang="ts">
import { useNotification } from "@kyvg/vue3-notification";
import { Visibility } from "@prisma/client";
import { FetchError } from "ofetch";
import type { Input, Output } from "valibot";

const { notify } = useNotification();

type Props = {
  recipe: {
    author: {
      username: string;
    };
    slug: string;
  };
  lists: {
    id: string;
    title: string;
  }[];
  refreshLists: () => Promise<void>;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "remove", id: string): void;
}>();

const { data: selectedLists, refresh } = await useFetch(
  `/api/recipes/${props.recipe.author.username}/${props.recipe.slug}/lists`,
);

const dialogRef = ref<Input<typeof ListFormSchema> | undefined>();

const disabledListIds = ref<string[]>([]);

const listOptions = computed(() => {
  return props.lists.map((list) => {
    return {
      ...list,
      selected:
        selectedLists.value?.some(
          (selectedList) => selectedList.id === list.id,
        ) ?? false,
      disabled: disabledListIds.value.includes(list.id),
    };
  });
});

const liked = computed(() => {
  return selectedLists.value?.length && selectedLists.value?.length > 0;
});

const createNewList = () => {
  dialogRef.value = { title: "", visibility: Visibility.PRIVATE };
};

const submit = async (list: Output<typeof ListFormSchema>) => {
  try {
    const result = await $fetch("/api/lists", {
      method: "POST",
      body: list,
    });

    notify({
      type: "success",
      title: `List ${list.title} created.`,
      text: "Your list has been successfully created.",
    });

    await props.refreshLists();

    toggleList({
      id: result.id,
      selected: false,
      title: list.title,
    });
  } catch (e) {
    if (e instanceof FetchError) {
      notify({
        type: "error",
        title: "Failed to create list.",
        text: e.message,
      });
      return;
    }

    notify({
      type: "error",
      title: "Failed to create list.",
      text: "An unknown error occurred.",
    });
  }
};

const toggleList = async (list: {
  id: string;
  selected: boolean;
  title: string;
}) => {
  disabledListIds.value.push(list.id);

  try {
    await $fetch(
      `/api/recipes/${props.recipe.author.username}/${props.recipe.slug}/lists/${list.id}`,
      {
        method: list.selected ? "DELETE" : "POST",
      },
    );

    await refresh();

    notify({
      type: "success",
      title: `Recipe ${list.selected ? "removed from" : "added to"} the list.`,
      text: `The recipe has been successfully ${
        list.selected ? "removed from" : "added to"
      } the ${list.title} list.`,
    });

    if (list.selected) {
      emit("remove", list.id);
    }
  } catch (e) {
    if (e instanceof FetchError) {
      notify({
        type: "error",
        title: "Failed to update the list.",
        text: e.message,
      });
      return;
    }

    notify({
      type: "error",
      title: "Failed to update the list.",
      text: "An unknown error occurred.",
    });
  } finally {
    disabledListIds.value = disabledListIds.value.filter(
      (id) => id !== list.id,
    );
  }
};
</script>

<template>
  <HeadlessPopover class="relative">
    <ListFormDialog v-model="dialogRef" :on-submit="submit" />
    <HeadlessPopoverButton as="template">
      <slot :liked="liked" name="activator" />
    </HeadlessPopoverButton>

    <HeadlessPopoverPanel
      class="absolute right-0 z-20 mt-1 max-h-80 w-80 overflow-auto rounded-3xl bg-surface-container shadow-2xl"
    >
      <ul class="my-0 list-none pl-0">
        <li
          v-for="(list, index) in listOptions"
          :key="list.id"
          class="flex cursor-pointer px-6 py-3 text-base hover:bg-outline/20"
          :class="{
            'border-b-1 border-b-outline/50 border-b-solid':
              index !== listOptions.length - 1,
            'text-primary': list.selected && !list.disabled,
            'text-outline cursor-not-allowed': list.disabled,
          }"
          @click.prevent.capture="toggleList(list)"
        >
          <div class="grow">
            {{ list.title }}
          </div>
          <div
            class="i-material-symbols:check-small-rounded h-6 w-6 scale-[1.25]"
            :class="{
              invisible: !list.selected,
            }"
          />
        </li>
        <li
          class="cursor-pointer from-primary to-secondary bg-gradient-to-r px-6 py-3 text-base text-white"
          @click.prevent.capture="createNewList"
        >
          Create new list
        </li>
      </ul>
    </HeadlessPopoverPanel>
  </HeadlessPopover>
</template>
