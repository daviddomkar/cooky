<script setup lang="ts">
import type { Input, Output } from "valibot";
import type { SubmissionHandler } from "vee-validate";

const props = defineProps<{
  initialValues?: Input<typeof SignUpFormSchema>;
  onSubmit?: SubmissionHandler<Output<typeof SignUpFormSchema>>;
}>();

const { handleSubmit, isSubmitting, handleReset } = useForm({
  validationSchema: toTypedSchema(SignUpFormSchema),
  initialValues: props.initialValues,
});

const submit = handleSubmit(async (values, opts) => {
  await props.onSubmit?.(values, opts);
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
    <TextField class="max-w-80" label="Name" name="name" />
    <TextField class="max-w-80" label="Username" name="username" />
    <TextField class="max-w-80" label="Email" name="email" type="email" />
    <TextField
      class="max-w-80"
      label="Password"
      name="password"
      type="password"
    />
    <TextField
      class="max-w-80"
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
    <slot name="trailing" />
  </form>
</template>
