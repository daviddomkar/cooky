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
  boolean,
  nullish,
} from "valibot";

import StepFormSchema from "./StepFormSchema";
import RecipeIngredientFormSchema from "~/schemas/RecipeIngredientFormSchema";

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
  ingredients: array(RecipeIngredientFormSchema, "This field is required."),
  steps: array(StepFormSchema, "This field is required."),
});
