import {
  string,
  toTrimmed,
  minLength,
  maxLength,
  email,
  object,
  boolean,
  regex,
  custom,
  forward,
  omitAsync,
  objectAsync,
  union,
} from "valibot";

export const LogInFormSchema = object({
  usernameOrEmail: union(
    [
      string("This field is required.", [
        toTrimmed(),
        minLength(1, "This field is required."),
        email("Invalid email."),
      ]),
      string("This field is required.", [
        toTrimmed(),
        minLength(1, "This field is required."),
      ]),
    ],
    "This field is required.",
  ),
  password: string("This field is required.", [
    toTrimmed(),
    minLength(1, "This field is required."),
  ]),
});

export const LogInSchema = objectAsync(LogInFormSchema.entries);

export const SignUpFormSchema = object(
  {
    name: string("This field is required.", [
      toTrimmed(),
      minLength(1, "This field is required."),
      maxLength(64, "Name is too long."),
    ]),
    username: string("This field is required.", [
      toTrimmed(),
      minLength(1, "This field is required."),
      maxLength(32, "Username is too long."),
    ]),
    email: string("This field is required.", [
      toTrimmed(),
      minLength(1, "This field is required."),
      maxLength(32, "Email is too long."),
      email("Invalid email."),
    ]),
    password: string("This field is required.", [
      toTrimmed(),
      minLength(1, "This field is required."),
      regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/,
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number!",
      ),
    ]),
    confirmPassword: string("This field is required.", [
      toTrimmed(),
      minLength(1, "This field is required."),
    ]),
    agreedToTermsAndPrivacyPolicy: boolean(
      "You must agree to our Terms & Privacy Policy.",
      [
        custom(
          (input) => input === true,
          "You must agree to our Terms & Privacy Policy.",
        ),
      ],
    ),
  },
  [
    forward(
      custom(
        (input) => input.password === input.confirmPassword,
        "Passwords do not match.",
      ),
      ["confirmPassword"],
    ),
  ],
);

export const SignUpSchema = omitAsync(SignUpFormSchema, [
  "confirmPassword",
  "agreedToTermsAndPrivacyPolicy",
]);
