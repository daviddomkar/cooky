<script setup lang="ts">
import type { Output } from "valibot";
import { useNotification } from "@kyvg/vue3-notification";

definePageMeta({
  layout: "auth",
  middleware: "guest-only",
});

const { signIn } = useAuth();
const { notify } = useNotification();

const logIn = async (values: Output<typeof LogInSchema>) => {
  try {
    await signIn("credentials", {
      usernameOrEmail: values.usernameOrEmail,
      password: values.password,
    });
  } catch (error) {
    notify({
      type: "error",
      title: "Failed to log in.",
      text: "Check your credentials and try again.",
    });
  }
};
</script>

<template>
  <div class="box-border flex items-center justify-center p-4 sm:p-8">
    <LogInForm :on-submit="logIn">
      <template #trailing>
        <p class="my-0 text-xs text-outline xl:hidden" to="/login">
          Not registered yet?
          <NuxtLink
            class="cursor-pointer text-primary underline"
            replace
            to="/auth/signup"
          >
            Sign up
          </NuxtLink>
        </p>
      </template>
    </LogInForm>
  </div>
</template>
