import { unionAsync } from "valibot";
import EditProfileFormSchema from "~/schemas/EditProfileFormSchema";

export default unionAsync(EditProfileFormSchema.options);
