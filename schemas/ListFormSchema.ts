import { Visibility } from "@prisma/client";
import {
  object,
  string,
  toTrimmed,
  minLength,
  enum_,
  nullish,
  uuid,
  transform,
} from "valibot";

export default transform(
  object({
    id: nullish(
      string("This field is required.", [
        uuid("This field must be a valid UUID."),
      ]),
    ),
    title: string("This field is required.", [
      toTrimmed(),
      minLength(1, "This field is required."),
    ]),
    visibility: enum_(Visibility, "This field is required."),
  }),
  (value) => {
    return {
      title: value.title,
      visibility: value.visibility,
    };
  },
);
