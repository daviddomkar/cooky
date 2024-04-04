import {
  objectAsync,
  coerce,
  string,
  number,
  nullable,
  optional,
  minValue,
  integer,
  boolean,
} from "valibot";

export default objectAsync({
  take: optional(
    nullable(
      coerce(
        number([
          minValue(1, "Min value is 1"),
          integer("Value must be an integer"),
        ]),
        Number,
      ),
    ),
  ),
  backwards: optional(
    nullable(coerce(boolean("Value must be a boolean"), Boolean)),
  ),
  prevCursor: optional(nullable(string("Value must be a string"))),
  nextCursor: optional(nullable(string("Value must be a string"))),
});
