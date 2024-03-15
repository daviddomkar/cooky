import { randomBytes } from "node:crypto";
import { RecipeState, UnitType } from "@prisma/client";
import { prisma } from "../server/utils/prisma-client";

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "test@test.com",
      password: "test",
      name: "Test User",
      username: "testuser",
    },
  });

  const image = await prisma.file.create({
    data: {
      mimeType: "image/jpeg",
      key: randomBytes(16),
    },
  });

  const ingredients = await Promise.all(
    [
      { title: "Mouka", unitTypes: [UnitType.VOLUME, UnitType.WEIGHT] },
      { title: "Vajíčka", unitTypes: [UnitType.QUANTITY] },
      { title: "Mléko", unitTypes: [UnitType.VOLUME] },
      { title: "Sůl", unitTypes: [UnitType.WEIGHT] },
      { title: "Olej", unitTypes: [UnitType.VOLUME] },
    ].map(async ({ title, unitTypes }) => {
      return await prisma.ingredient.create({
        data: {
          title,
          unitTypes,
        },
      });
    }),
  );

  const units = await Promise.all(
    [
      { title: "gram", abbreviation: "g", type: UnitType.WEIGHT },
      { title: "kusy", abbreviation: "ks", type: UnitType.QUANTITY },
      { title: "militry", abbreviation: "ml", type: UnitType.VOLUME },
    ].map(async ({ title, abbreviation, type }) => {
      return await prisma.unit.create({
        data: {
          title,
          abbreviation,
          type,
        },
      });
    }),
  );

  const recipeIngredients = [
    {
      amount: 200,
      ingredientId: ingredients[0].id,
      unitId: units[0].id,
    },
    {
      amount: 2,
      ingredientId: ingredients[1].id,
      unitId: units[1].id,
    },
    {
      amount: 500,
      ingredientId: ingredients[2].id,
      unitId: units[2].id,
    },
    {
      amount: 1,
      ingredientId: ingredients[3].id,
      unitId: units[0].id,
    },
    {
      amount: 1,
      ingredientId: ingredients[4].id,
      unitId: units[2].id,
    },
  ];

  const categories = await Promise.all(
    [
      { title: "Snídaně", order: 1, icon: "breakfast" },
      { title: "Večeře", order: 2, icon: "dinner" },
      { title: "Oběd", order: 3, icon: "lunch" },
    ].map(async ({ title, order, icon }) => {
      return await prisma.category.create({
        data: {
          title,
          order,
          icon,
        },
      });
    }),
  );

  await prisma.recipe.create({
    title: "Palačinky",
    description: "Velmi dobré palačinky",
    preparationDuration: {
      days: 0,
      hours: 0,
      minutes: 20,
      seconds: 0,
    },
    state: RecipeState.PUBLISHED,
    steps: [
      {
        title: "Smíchání surovin",
        content: "Smíchejte všechny suroviny dohromady",
      },
      {
        title: "Opečení palačinek",
        content: "Opečte palačinky",
      },
    ],
    nutritionPerServing: 400,
    numberOfServings: 2,
    imageId: image.id,
    authorId: user.id,
    recipeIngredients,
    categories: categories.map(({ id }) => id),
  });
}

main();
