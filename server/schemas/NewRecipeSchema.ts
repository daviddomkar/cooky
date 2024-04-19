import { objectAsync } from "valibot";
import RecipeFormSchema from "~/schemas/RecipeFormSchema";

export default objectAsync(RecipeFormSchema.entries);
