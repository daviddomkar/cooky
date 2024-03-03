<script setup lang="ts">
const { signIn } = useAuth();

definePageMeta({
  layout: "auth",
  middleware: "guest-only",
});

const usernameOrEmail = ref("");
const password = ref("");

const logIn = async () => {
  try {
    await signIn("credentials", {
      usernameOrEmail: usernameOrEmail.value,
      password: password.value,
    });
  } catch (error) {
    console.error(error);
    // TODO display error
  }
};
</script>

<template>
  <div>
    <div class="flex flex-col">
      <h1>Log in to your account</h1>
      <input
        v-model="usernameOrEmail"
        placeholder="username or email"
        type="text"
      />
      <input v-model="password" placeholder="password" type="password" />
      <button @click="logIn">Log in</button>
    </div>
  </div>
</template>
