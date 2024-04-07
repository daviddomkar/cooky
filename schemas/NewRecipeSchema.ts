import { UnitType } from "@prisma/client";
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
  union,
  optional,
  enum_,
  nullable,
} from "valibot";

export const RecipeIngredientSchema = object({
  ingredient: union([
    object({
      id: string("This field is required.", [
        toTrimmed(),
        minLength(1, "This field is required."),
      ]),
      unitTypes: optional(
        nullable(array(enum_(UnitType), "This field is required.")),
      ),
    }),
    object({
      title: string("This field is required.", [
        toTrimmed(),
        minLength(1, "This field is required."),
      ]),
      unitTypes: array(string(), "This field is required.", []),
    }),
  ]),
  amount: number("This field is required.", [
    minValue(1, "Value must be at least 1."),
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
  ingredients: array(RecipeIngredientSchema, "This field is required.", [
    maxLength(32, "Recipe can have up to 32 ingredients."),
  ]),
  steps: array(StepSchema, "This field is required.", [
    maxLength(32, "Recipe can have up to 32 steps."),
  ]),
});
