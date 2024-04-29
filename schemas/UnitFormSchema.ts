import { UnitType } from "@prisma/client";
import {
  object,
  string,
  toTrimmed,
  minLength,
  nullish,
  uuid,
  transform,
  enum_,
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
    type: enum_(UnitType, "This field is required."),
    abbreviation: string("This field is required.", [
      toTrimmed(),
      minLength(1, "This field is required."),
    ]),
  }),
  (value) => {
    return {
      title: value.title,
      type: value.type,
      abbreviation: value.abbreviation,
    };
  },
);
