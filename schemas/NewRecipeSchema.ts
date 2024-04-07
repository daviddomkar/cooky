import {
  array,
  string,
  toTrimmed,
  minLength,
  maxLength,
  object,
  number,
  minValue,
  blob,
  mimeType,
  maxSize,
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
  image: blob("Image is required.", [
    mimeType(
      ["image/jpeg", "image/png"],
      "The file must be an image (.jpeg or .png).",
    ),
    maxSize(10 * 1024 * 1024, "The file size must be less than 10MB."),
  ]),
  ingredients: array(
    object({
      id: string("This field is required.", [
        toTrimmed(),
        minLength(1, "This field is required."),
      ]),
      amount: number("This field is required.", [
        minValue(1, "Value must be at least 1."),
      ]),
    }),
    "This field is required.",
    [maxLength(32, "Recipe can have up to 32 ingredients.")],
  ),
  steps: array(
    object({
      title: string("This field is required.", [
        minLength(1, "This field is required."),
      ]),
      content: string("This field is required.", [
        minLength(1, "This field is required."),
      ]),
    }),
    "This field is required.",
    [maxLength(32, "Recipe can have up to 32 ingredients.")],
  ),
});
