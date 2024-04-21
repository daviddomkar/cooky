import {
  string,
  toTrimmed,
  minLength,
  object,
  number,
  coerce,
  minValue,
  uuid,
  notValue,
} from "valibot";

export default object({
  ingredient: IngredientFormSchema,
  amount: coerce(
    number("This field is required.", [
      minValue(0, "The value must be greater than 0."),
      notValue(0, "The value must be greater than 0."),
    ]),
    Number,
  ),
  unitId: string("This field is required.", [
    toTrimmed(),
    minLength(1, "This field is required."),
    uuid("Invalid unit ID."),
  ]),
});
