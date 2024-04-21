import { objectAsync, mergeAsync, arrayAsync } from "valibot";

export default mergeAsync([
  RecipeFormSchema,
  objectAsync({
    ingredients: arrayAsync(RecipeIngredientSchema, "This field is required."),
  }),
]);
