import {
  object,
  string,
  toTrimmed,
  minLength,
  nullish,
  uuid,
  transform,
  array,
} from "valibot";

export default transform(
  object({
    id: nullish(
      string("This field is required.", [
        uuid("This field must be a valid UUID."),
      ]),
    ),
    name: string("This field is required.", [
      toTrimmed(),
      minLength(1, "This field is required."),
    ]),
    username: string("This field is required.", [
      toTrimmed(),
      minLength(1, "This field is required."),
    ]),
    email: string("This field is required.", [
      toTrimmed(),
      minLength(1, "This field is required."),
    ]),
    roles: array(
      string("This field is required.", [
        uuid("This field must be a valid UUID."),
      ]),
      "This field is required.",
    ),
  }),
  (value) => {
    return {
      name: value.name,
      username: value.username,
      email: value.email,
      roles: value.roles,
    };
  },
);
