import { objectAsync } from "valibot";
import LogInFormSchema from "~/schemas/LogInFormSchema";

export default objectAsync(LogInFormSchema.entries);
