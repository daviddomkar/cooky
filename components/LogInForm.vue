<script setup lang="ts">
const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(LogInFormSchema),
});

const onSubmit = handleSubmit((values) => {
  console.log(values);
});
</script>

<template>
  <form class="w-full flex flex-col items-center gap-2" @submit="onSubmit">
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
    <BaseButton class="mt-2 sm:mt-4" type="submit">Log in</BaseButton>
    <p class="text-outline" to="/login">
      Not registered yet?
      <a class="cursor-pointer text-primary underline">Sign up</a>
    </p>
  </form>
</template>
