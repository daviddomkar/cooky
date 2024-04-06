import {
  array,
  string,
  toTrimmed,
  minLength,
  maxLength,
  object,
  uuid,
  number,
  minValue,
} from "valibot";

export default object({
  title: string("This field is required.", [
    toTrimmed(),
    minLength(1, "This field is required."),
    maxLength(64, "Title is too long."),
  ]),
  description: string("This field is required.", [
    toTrimmed(),
    minLength(1, "This field is required."),
    maxLength(64, "Title is too long."),
  ]),
  ingredients: array(
    object({
      id: string("This field is required.", [
        toTrimmed(),
        minLength(1, "This field is required."),
        uuid("Ingredient ID must be a valid UUID."),
      ]),
      amount: number("This field is required.", [
        minValue(1, "Value must be at least 1."),
      ]),
    }),
    "This field is required.",
    [maxLength(32, "Recipe can have up to 32 ingredients.")],
  ),
});
