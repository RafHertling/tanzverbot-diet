import { assertEquals, assertThrows } from "@std/assert";
import { calcDateOnDiet, Sex } from "./tanzverbot_diet.ts";

Deno.test("male: returns correct days for normal case", () => {
  assertEquals(calcDateOnDiet(74, 100, 1.86, 38, Sex.Male), 36);
});

Deno.test("female: returns correct days for normal case", () => {
  assertEquals(calcDateOnDiet(60, 70, 1.65, 30, Sex.Female), 13);
});

Deno.test("same current and target weight returns 0 days", () => {
  assertEquals(calcDateOnDiet(74, 74, 1.86, 38, Sex.Male), 0);
});

Deno.test("throws when target weight is lower than current weight", () => {
  assertThrows(
    () => calcDateOnDiet(100, 74, 1.86, 38, Sex.Male),
    Error,
    "gaining weight",
  );
});

Deno.test("throws when age is below 16", () => {
  assertThrows(
    () => calcDateOnDiet(74, 100, 1.86, 15, Sex.Male),
    Error,
    "do not qualify",
  );
});

Deno.test("age exactly 16 is allowed", () => {
  const days = calcDateOnDiet(74, 100, 1.86, 16, Sex.Male);
  assertEquals(typeof days, "number");
});

Deno.test("throws when height is below 1.5 m", () => {
  assertThrows(
    () => calcDateOnDiet(74, 100, 1.49, 38, Sex.Male),
    Error,
    "do not qualify",
  );
});

Deno.test("height exactly 1.5 m is allowed", () => {
  const days = calcDateOnDiet(74, 100, 1.5, 38, Sex.Male);
  assertEquals(typeof days, "number");
});

Deno.test("throws when BMR exceeds diet calories", () => {
  assertThrows(
    () => calcDateOnDiet(600, 700, 2.5, 16, Sex.Male),
    Error,
    "not sufficient",
  );
});
