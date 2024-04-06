<script setup lang="ts">
import type { Input, Output } from "valibot";
import type { SubmissionHandler } from "vee-validate";

const props = defineProps<{
  initialValues?: Input<typeof LogInFormSchema>;
  onSubmit?: SubmissionHandler<Output<typeof LogInFormSchema>>;
}>();

const { handleSubmit, isSubmitting, handleReset } = useForm({
  validationSchema: toTypedSchema(LogInFormSchema),
  initialValues: props.initialValues,
});

const submit = handleSubmit(async (values, opts) => {
  await props.onSubmit?.(values, opts);
});
</script>

<template>
  <form
    class="w-full flex flex-col items-center"
    @reset="handleReset"
    @submit="submit"
  >
    <div class="mb-8 box-border">
      <h1 class="my-0 select-none text-center text-8xl xl:hidden sm:text-9xl">
        COOKY
      </h1>
      <h2
        class="my-0 select-none from-primary to-secondary bg-gradient-to-r bg-clip-text text-center text-4xl text-transparent uppercase sm:text-5xl xl:text-8xl xl:text-on-surface"
      >
        You're back!
      </h2>
    </div>
    <TextField
      class="max-w-80"
      label="Username / Email"
      name="usernameOrEmail"
    />
    <TextField
      class="mb-2 max-w-80"
      label="Password"
      name="password"
      type="password"
    />
    <BaseButton class="mb-8 mt-4" :loading="isSubmitting" type="submit">
      Log in
    </BaseButton>
    <slot name="trailing" />
  </form>
</template>
