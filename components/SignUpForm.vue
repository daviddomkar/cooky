<script setup lang="ts">
import {
  custom,
  email,
  forward,
  maxLength,
  minLength,
  object,
  regex,
  string,
  toTrimmed,
} from "valibot";

const SignUpSchema = object(
  {
    name: string("This field is required.", [
      toTrimmed(),
      minLength(1, "This field is required."),
      maxLength(64, "Name is too long."),
    ]),
    username: string("This field is required.", [
      toTrimmed(),
      minLength(1, "This field is required."),
      maxLength(32, "Username is too long."),
    ]),
    email: string("This field is required.", [
      toTrimmed(),
      minLength(1, "This field is required."),
      maxLength(32, "Email is too long."),
      email("Invalid email."),
    ]),
    password: string("This field is required.", [
      toTrimmed(),
      minLength(1, "This field is required."),
      regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/,
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number!",
      ),
    ]),
    confirmPassword: string("This field is required.", [
      toTrimmed(),
      minLength(1, "This field is required."),
    ]),
  },
  [
    forward(
      custom(
        (input) => input.password === input.confirmPassword,
        "Passwords do not match.",
      ),
      ["confirmPassword"],
    ),
  ],
);

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(SignUpSchema),
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
    <BaseButton class="mt-2 sm:mt-4" type="submit">Sign up</BaseButton>
    <p class="text-outline" to="/login">
      Already have an account?
      <a class="cursor-pointer text-primary underline">Log in</a>
    </p>
  </form>
</template>
