<script setup lang="ts">
const { signIn } = useAuth();

definePageMeta({
  layout: "auth",
  middleware: "guest-only",
});

const name = ref("");
const username = ref("");
const email = ref("");
const password = ref("");

const signUp = async () => {
  try {
    await $fetch("/api/auth/signup", {
      method: "POST",
      body: {
        name: name.value,
        username: username.value,
        email: email.value,
        password: password.value,
      },
    });
  } catch (error) {
    console.error(error);
    // TODO display error
    return;
  }

  signIn("credentials", {
    usernameOrEmail: username.value,
    password: password.value,
  });
};
</script>

<template>
  <div>
    <div class="flex flex-col">
      <h1>Create your account</h1>
      <input v-model="name" placeholder="name" type="text" />
      <input v-model="username" placeholder="username" type="text" />
      <input v-model="email" placeholder="email" type="email" />
      <input v-model="password" placeholder="password" type="password" />
      <button @click="signUp">Sign up</button>
    </div>
  </div>
</template>
