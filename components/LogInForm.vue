<script setup lang="ts">
import type { Input, Output } from "valibot";

const props = defineProps<{
  initialValues?: Input<typeof LogInFormSchema>;
  onSubmit?: (values: Output<typeof LogInFormSchema>) => Promise<void>;
}>();

const { handleSubmit, isSubmitting, handleReset } = useForm({
  validationSchema: toTypedSchema(LogInFormSchema),
  initialValues: props.initialValues,
});

const submit = handleSubmit(async (values, { resetForm }) => {
  try {
    await props.onSubmit?.(values);
    resetForm({
      values: {
        usernameOrEmail: "",
        password: "",
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
});
</script>

<template>
  <form
    class="w-full flex flex-col items-center gap-2"
    @reset="handleReset"
    @submit="submit"
  >
    <div class="mb-6 box-border sm:mb-8">
      <h1 class="my-0 select-none text-center text-8xl sm:text-9xl">COOKY</h1>
      <h2
        class="my-0 select-none from-primary to-secondary bg-gradient-to-r bg-clip-text text-center text-4xl text-transparent uppercase sm:text-5xl"
      >
        You're back!
      </h2>
    </div>
    <TextField label="Username / Email" name="usernameOrEmail" type="text" />
    <TextField label="Password" name="password" type="password" />
    <BaseButton class="mt-2 sm:mt-4" :loading="isSubmitting" type="submit">
      Log in
    </BaseButton>
    <p class="text-xs text-outline" to="/login">
      Not registered yet?
      <NuxtLink
        class="cursor-pointer text-primary underline"
        replace
        to="/auth/signup"
      >
        Sign up
      </NuxtLink>
    </p>
  </form>
</template>
