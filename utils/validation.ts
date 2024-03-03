import {
  string,
  toTrimmed,
  minLength,
  maxLength,
  email,
  objectAsync,
} from "valibot";

export const LoginSchema = objectAsync({
  usernameOrEmail: string("this field is required", [
    toTrimmed(),
    minLength(1, "this field is required"),
  ]),
  password: string("this field is required", [
    toTrimmed(),
    minLength(1, "this field is required"),
  ]),
});

export const SignupSchema = objectAsync({
  name: string("this field is required", [
    toTrimmed(),
    minLength(1, "this field is required"),
    maxLength(64, "name is too long"),
  ]),
  username: string("this field is required", [
    toTrimmed(),
    minLength(1, "this field is required"),
    maxLength(32, "username is too long"),
  ]),
  email: string("this field is required", [
    toTrimmed(),
    minLength(1, "this field is required"),
    maxLength(32, "email is too long"),
    email("invalid email"),
  ]),
  password: string("this field is required", [
    toTrimmed(),
    minLength(1, "this field is required"),
  ]),
});
