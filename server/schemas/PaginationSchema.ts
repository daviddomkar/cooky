import {
  objectAsync,
  coerce,
  string,
  number,
  minValue,
  integer,
  toTrimmed,
  nullish,
} from "valibot";

export default objectAsync({
  take: nullish(
    coerce(
      number("Limit must be an integer.", [
        minValue(1, "Limit must be at least 1."),
        integer("Limit must be an integer."),
      ]),
      Number,
    ),
  ),
  after: nullish(string("After must be a string.", [toTrimmed()])),
  before: nullish(string("Before must be a string.", [toTrimmed()])),
});
