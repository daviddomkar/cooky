import { UnitType } from "@prisma/client";
import {
  array,
  string,
  toTrimmed,
  minLength,
  object,
  uuid,
  enum_,
  union,
  transform,
} from "valibot";

export default union(
  [
    transform(
      object(
        {
          id: string("This field is required.", [
            toTrimmed(),
            minLength(1, "This field is required."),
            uuid("Invalid ingredient ID."),
          ]),
          title: string("This field is required.", [
            toTrimmed(),
            minLength(1, "This field is required."),
          ]),
          unitTypes: array(enum_(UnitType), "This field is required.", [
            minLength(1, "This field is required."),
          ]),
        },
        "This field is required.",
      ),
      (value) => {
        return {
          id: value.id,
          unitTypes: value.unitTypes,
        };
      },
    ),
    object(
      {
        title: string("This field is required.", [
          toTrimmed(),
          minLength(1, "This field is required."),
        ]),
        unitTypes: array(enum_(UnitType), "This field is required.", [
          minLength(1, "This field is required."),
        ]),
      },
      "This field is required.",
    ),
  ],
  "This field is required.",
);
