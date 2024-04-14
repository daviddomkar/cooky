import { string, minLength, object } from "valibot";

export default object({
  title: string("This field is required.", [
    minLength(1, "This field is required."),
  ]),
  content: string("This field is required.", [
    minLength(1, "This field is required."),
  ]),
});
