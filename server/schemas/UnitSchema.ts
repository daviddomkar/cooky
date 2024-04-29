import { objectAsync } from "valibot";
import UnitFormSchema from "~/schemas/UnitFormSchema";

export default objectAsync(UnitFormSchema.entries);
