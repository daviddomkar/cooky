import { Visibility } from "@prisma/client";
import { object, string, toTrimmed, minLength, enum_ } from "valibot";

export default object({
  title: string("This field is required.", [
    toTrimmed(),
    minLength(1, "This field is required."),
  ]),
  visibility: enum_(Visibility, "This field is required."),
});
