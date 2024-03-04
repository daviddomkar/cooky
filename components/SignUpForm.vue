<script setup lang="ts">
import type { Input, Output } from "valibot";

const props = defineProps<{
  initialValues?: Input<typeof SignUpFormSchema>;
  onSubmit?: (values: Output<typeof SignUpFormSchema>) => Promise<void>;
}>();

const { handleSubmit, isSubmitting, handleReset } = useForm({
  validationSchema: toTypedSchema(SignUpFormSchema),
  initialValues: props.initialValues,
});

const submit = handleSubmit(async (values, { resetForm }) => {
  try {
    await props.onSubmit?.(values);
    resetForm({
      values: {
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreedToTermsAndPrivacyPolicy: false,
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
        Create your<br />account
      </h2>
    </div>
    <TextField label="Name" name="name" type="text" />
    <TextField label="Username" name="username" type="text" />
    <TextField label="Email" name="email" type="email" />
    <TextField label="Password" name="password" type="password" />
    <TextField
      label="Confirm password"
      name="confirmPassword"
      type="password"
    />
    <BaseCheckbox name="agreedToTermsAndPrivacyPolicy">
      Agree to our <a class="cursor-pointer text-primary underline">Terms</a> &
      <a class="cursor-pointer text-primary underline">Privacy Policy</a>
    </BaseCheckbox>
    <BaseButton class="mt-2 sm:mt-4" :loading="isSubmitting" type="submit">
      Sign up
    </BaseButton>
    <p class="text-xs text-outline">
      Already have an account?
      <NuxtLink
        class="cursor-pointer text-primary underline"
        replace
        to="/auth/login"
      >
        Log in
      </NuxtLink>
    </p>
  </form>
</template>
