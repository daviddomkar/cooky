<script setup lang="ts">
import type { Output } from "valibot";

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
    // eslint-disable-next-line no-console
    console.error(error);

    notify({
      title: "Error",
      text: "Ajajaj",
    });

    console.log("after notify");
  }
};
</script>

<template>
  <div class="box-border h-full flex items-center justify-center p-8">
    <LogInForm :on-submit="logIn">
      <template #trailing>
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
      </template>
    </LogInForm>
  </div>
</template>
