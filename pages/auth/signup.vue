<script setup lang="ts">
import type { Output } from "valibot";

const { signIn } = useAuth();

definePageMeta({
  layout: "auth",
  middleware: "guest-only",
});

const signUp = async (values: Output<typeof SignUpSchema>) => {
  try {
    await $fetch("/api/auth/signup", {
      method: "POST",
      body: {
        name: values.name,
        username: values.username,
        email: values.email,
        password: values.password,
      },
    });

    await signIn("credentials", {
      usernameOrEmail: values.username,
      password: values.password,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};
</script>

<template>
  <div class="box-border flex items-center justify-center p-4 sm:p-8">
    <SignUpForm :on-submit="signUp">
      <template #trailing>
        <p class="my-0 text-xs text-outline xl:hidden">
          Already have an account?
          <NuxtLink
            class="cursor-pointer text-primary underline"
            replace
            to="/auth/login"
          >
            Log in
          </NuxtLink>
        </p>
      </template>
    </SignUpForm>
  </div>
</template>
