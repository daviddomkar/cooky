import { objectAsync, mergeAsync } from "valibot";

export default mergeAsync([
  RecipeIngredientFormSchema,
  objectAsync({
    ingredient: IngredientSchema,
  }),
]);
