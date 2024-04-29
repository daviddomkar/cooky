import { omitAsync } from "valibot";

export default omitAsync(SignUpFormSchema, [
  "confirmPassword",
  "agreedToTermsAndPrivacyPolicy",
]);
