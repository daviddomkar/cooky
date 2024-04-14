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
  regex,
  uuid,
  notValue,
  boolean,
  nullish,
} from "valibot";

export const RecipeIngredientSchema = object({
  ingredient: IngredientFormSchema,
  amount: number("This field is required.", [
    minValue(0, "The value must be greater than 0."),
    notValue(0, "The value must be greater than 0."),
  ]),
  unitId: string("This field is required.", [
    toTrimmed(),
    minLength(1, "This field is required."),
    uuid("Invalid unit ID."),
  ]),
});

export const StepSchema = object({
  title: string("This field is required.", [
    minLength(1, "This field is required."),
  ]),
  content: string("This field is required.", [
    minLength(1, "This field is required."),
  ]),
});

export default object({
  draft: nullish(boolean(), true),
  title: string("This field is required.", [
    toTrimmed(),
    minLength(1, "This field is required."),
    maxLength(64, "Title is too long."),
  ]),
  preparationDuration: string("This field is required.", [
    toTrimmed(),
    minLength(1, "This field is required."),
    regex(/^\d{2}:\d{2}$/, "Invalid format. Use HH:MM."),
  ]),
  nutritionPerServing: number("This field is required.", [
    minValue(1, "Value must be at least 1."),
  ]),
  numberOfServings: number("This field is required.", [
    minValue(1, "Value must be at least 1."),
  ]),
  categories: array(
    string("This field is required.", [uuid("Invalid category ID.")]),
    "This field is required.",
    [minLength(1, "This field is required.")],
  ),
  description: string("This field is required.", [
    toTrimmed(),
    minLength(1, "This field is required."),
    maxLength(640, "Description is too long."),
  ]),
  image: blob("This field is required.", [
    mimeType(
      ["image/jpeg", "image/png"],
      "The file must be an image (.jpeg or .png).",
    ),
    maxSize(10 * 1024 * 1024, "The file size must be less than 10MB."),
  ]),
  ingredients: array(RecipeIngredientSchema, "This field is required."),
  steps: array(StepSchema, "This field is required."),
});
