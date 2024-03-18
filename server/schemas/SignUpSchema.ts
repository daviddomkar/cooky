import { omitAsync } from "valibot";
import SignUpFormSchema from "~/schemas/SignUpFormSchema";

export default omitAsync(SignUpFormSchema, [
  "confirmPassword",
  "agreedToTermsAndPrivacyPolicy",
]);
