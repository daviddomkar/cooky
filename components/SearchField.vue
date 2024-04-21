<script setup lang="ts">
import { object, string } from "valibot";

const emit = defineEmits<{
  (e: "search", query: string): void;
}>();

const { handleSubmit, handleReset } = useForm({
  validationSchema: toTypedSchema(object({ search: string() })),
  initialValues: {
    search: "",
  },
});

const submit = handleSubmit((values) => {
  emit("search", values.search);
});
</script>

<template>
  <form
    class="relative box-border h-12 flex"
    @reset="handleReset"
    @submit="submit"
  >
    <TextField label="Search" name="search">
      <template #trailing>
        <BaseButton class="mr-0.75 md:!px-8" spread="compact" type="submit">
          <div class="i-cooky:search h-6 w-6" />
        </BaseButton>
      </template>
    </TextField>
  </form>
</template>
