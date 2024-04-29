import {
  object,
  string,
  toTrimmed,
  minLength,
  nullish,
  uuid,
  transform,
  number,
  minValue,
  coerce,
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
    order: coerce(
      number("This field is required.", [
        minValue(0, "Order cannot be less than 0"),
      ]),
      Number,
    ),
  }),
  (value) => {
    return {
      title: value.title,
      slug: value.slug,
      icon: value.icon,
      order: value.order,
    };
  },
);
