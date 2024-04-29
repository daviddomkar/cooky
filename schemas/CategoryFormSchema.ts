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
    title: string("This field is required.", [
      toTrimmed(),
      minLength(1, "This field is required."),
    ]),
    slug: string("This field is required.", [
      toTrimmed(),
      minLength(1, "This field is required."),
    ]),
    icon: string("This field is required.", [
      toTrimmed(),
      minLength(1, "This field is required."),
    ]),
  }),
  (value) => {
    return {
      title: value.title,
      slug: value.slug,
      icon: value.icon,
    };
  },
);
