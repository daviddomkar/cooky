import {
  object,
  string,
  toTrimmed,
  minLength,
  nullish,
  uuid,
  transform,
  picklist,
  array,
} from "valibot";

export default transform(
  object({
    id: nullish(
      string("This field is required.", [
        uuid("This field must be a valid UUID."),
      ]),
    ),
    title: string("This field is required.", [
      toTrimmed(),
      minLength(1, "This field is required."),
    ]),
    permissions: array(
      picklist(Object.values(permissions), "This field is required."),
      "This field is required.",
      [minLength(1, "This field is required.")],
    ),
  }),
  (value) => {
    return {
      title: value.title,
      permissions: value.permissions,
    };
  },
);
