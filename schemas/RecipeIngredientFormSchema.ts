import {
  string,
  toTrimmed,
  minLength,
  object,
  number,
  minValue,
  uuid,
  notValue,
} from "valibot";

import IngredientFormSchema from "~/schemas/IngredientFormSchema";

export default object({
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
