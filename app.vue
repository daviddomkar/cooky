<script setup lang="ts">
const auth = useAuth();

console.log(auth.session.value);

const signIn = () => {
  auth.signIn("credentials", {
    usernameOrEmail: "keyqlin",
    password: "davidek",
  });
};
</script>

<template>
  <div>
    <h1>Hello World!</h1>
    <button @click="signIn">Show Alert</button>
  </div>
</template>
