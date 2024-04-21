import { UnitType } from "@prisma/client";
import {
  unionAsync,
  array,
  string,
  toTrimmed,
  minLength,
  object,
  uuid,
  enum_,
  nullish,
} from "valibot";

export default unionAsync([
  object({
    title: string("This field is required.", [
      toTrimmed(),
      minLength(1, "This field is required."),
    ]),
    unitTypes: array(
      enum_(UnitType, "This field is required."),
      "This field is required.",
      [minLength(1, "This field is required.")],
    ),
  }),
  object({
    id: string("This field is required.", [
      toTrimmed(),
      minLength(1, "This field is required."),
      uuid("Invalid ingredient ID."),
    ]),
    unitTypes: nullish(
      array(
        enum_(UnitType, "This field is required."),
        "This field is required.",
        [minLength(1, "This field is required.")],
      ),
    ),
  }),
]);
