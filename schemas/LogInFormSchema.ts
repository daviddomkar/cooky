import { string, toTrimmed, minLength, email, object, union } from "valibot";

export default object({
  usernameOrEmail: union(
    [
      string("This field is required.", [
        toTrimmed(),
        minLength(1, "This field is required."),
        email("Invalid email."),
      ]),
      string("This field is required.", [
        toTrimmed(),
        minLength(1, "This field is required."),
      ]),
    ],
    "This field is required.",
  ),
  password: string("This field is required.", [
    toTrimmed(),
    minLength(1, "This field is required."),
  ]),
});
