import {
  object,
  string,
  toTrimmed,
  minLength,
  nullish,
  uuid,
  transform,
} from "valibot";

export default transform(
  object({
    id: nullish(
      string("This field is required.", [
        uuid("This field must be a valid UUID."),
      ]),
    ),
    content: string("This field is required.", [
      toTrimmed(),
      minLength(1, "This field is required."),
    ]),
  }),
  (value) => {
    return {
      content: value.content,
    };
  },
);