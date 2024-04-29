import { objectAsync } from "valibot";
import CategoryFormSchema from "~/schemas/CategoryFormSchema";

export default objectAsync(CategoryFormSchema.entries);
