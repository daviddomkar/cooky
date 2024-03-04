<script setup lang="ts">
import type { Output } from "valibot";

const { signIn } = useAuth();

definePageMeta({
  layout: "auth",
  middleware: "guest-only",
});

const logIn = async (values: Output<typeof LogInSchema>) => {
  try {
    await signIn("credentials", {
      usernameOrEmail: values.usernameOrEmail,
      password: values.password,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    throw error;
  }
};
</script>

<template>
  <div class="box-border h-full flex items-center justify-center p-8">
    <LogInForm :on-submit="logIn" />
  </div>
</template>
