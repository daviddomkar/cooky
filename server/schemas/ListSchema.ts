import { objectAsync } from "valibot";
import ListFormSchema from "~/schemas/ListFormSchema";

export default objectAsync(ListFormSchema.entries);
