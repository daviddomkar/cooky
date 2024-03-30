import {
  blob,
  maxSize,
  mimeType,
  object,
  union,
  toTrimmed,
  minLength,
  string,
} from "valibot";

export default union([
  object({
    name: string("This field is required.", [
      toTrimmed(),
      minLength(1, "This field is required."),
    ]),
  }),
  object({
    profileImage: blob("This field is required.", [
      mimeType(
        ["image/jpeg", "image/png", "image/gif"],
        "The file must be an image (jpeg, png or gif).",
      ),
      maxSize(5 * 1024 * 1024, "The file size must be less than 5MB."),
    ]),
  }),
  object({
    coverImage: blob("This field is required.", [
      mimeType(
        ["image/jpeg", "image/png", "image/gif"],
        "The file must be an image (jpeg, png or gif).",
      ),
      maxSize(5 * 1024 * 1024, "The file size must be less than 5MB."),
    ]),
  }),
]);
