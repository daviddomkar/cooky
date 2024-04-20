<script setup lang="ts">
type List = {
  id: string;
  title: string;
};
type Props = {
  lists: List[];
};
const props = defineProps<Props>();

type EventValue = {
  selected: string[];
  create: string | null;
};
const emit = defineEmits<{
  (e: "submit", value: EventValue): void;
}>();

const open = ref(false);
const selectedLists: Record<string, Ref<boolean>> = {};
props.lists.forEach((list) => {
  selectedLists[list.id] = ref(false);
});
const newListTitle = ref("");

const handleSubmit = () => {
  emit("submit", {
    selected: Object.keys(selectedLists).filter((x) => selectedLists[x].value),
    create: newListTitle.value || null,
  });
  open.value = false;
};
</script>

<template>
  <BasePopup v-model="open">
    <template #target>
      <BaseButton spread="compact" @click="() => (open = !open)">
        <template #icon>
          <div class="i-cooky:favourites" />
        </template>
        SAVE
      </BaseButton>
    </template>
    <div class="menu">
      <ul class="list-none rounded-xl bg-surface p-0 shadow-2xl">
        <li
          v-for="list of lists"
          :key="list.id"
          class="border-0 border-b-1 border-on-surface border-solid px-3 py-2 text-nowrap"
        >
          <BaseCheckbox
            v-model="selectedLists[list.id].value"
            :name="list.id"
            >{{ list.title }}</BaseCheckbox
          >
        </li>
        <li>
          <input v-model="newListTitle" type="text" />
          <BaseButton @click="handleSubmit">OK</BaseButton>
        </li>
      </ul>
    </div>
  </BasePopup>
</template>
