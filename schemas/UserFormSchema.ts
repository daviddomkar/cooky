import {
  object,
  string,
  toTrimmed,
  minLength,
  nullish,
  uuid,
  transform,
  array,
  notValue,
  toLowerCase,
  maxLength,
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
      toLowerCase(),
      minLength(1, "This field is required."),
      maxLength(32, "Username is too long."),
      // TODO: Correctly handle reserved usernames (lowercase, etc.)
      ...[
        "drafts",
        "most-rated",
        "most-saved",
        "random",
        "recent",
        "admin",
        "auth",
        "category",
        "list",
        "search",
        "edit",
        "new",
        "admin",
      ].map((reserved) =>
        notValue<string, string>(
          reserved,
          `Username "${reserved}" is reserved.`,
        ),
      ),
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
