import { UnitType } from "@prisma/client";
import {
  array,
  string,
  toTrimmed,
  minLength,
  object,
  uuid,
  enum_,
  transform,
  nullish,
} from "valibot";

export default transform(
  object(
    {
      id: nullish(
        string("This field is required.", [
          toTrimmed(),
          minLength(1, "This field is required."),
          uuid("Invalid ingredient ID."),
        ]),
      ),
      title: string("This field is required.", [
        toTrimmed(),
        minLength(1, "This field is required."),
      ]),
      unitTypes: array(
        enum_(UnitType, "This field is required."),
        "This field is required.",
        [minLength(1, "This field is required.")],
      ),
    },
    "This field is required.",
  ),
  (value) => {
    if (!value.id) {
      return {
        title: value.title,
        unitTypes: value.unitTypes,
      };
    }

    return {
      id: value.id,
      unitTypes: value.unitTypes,
    };
  },
);
