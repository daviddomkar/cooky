import { PrismaClient, UnitType } from "@prisma/client";
import { hash } from "bcrypt";
import scrapedData from "./seed_data/scraped.json" assert { type: "json" };

const prisma = new PrismaClient();

async function getMimeTypeFromUrl(url: string) {
  const reponse = await fetch(url, {
    method: "HEAD",
  });
  return reponse.headers.get("Content-Type") ?? "image/jpeg";
}

async function main() {
  const usersData = await Promise.all(
    scrapedData.users.map(async (x) => {
      return {
        ...x,
        password: await hash(`${x.username}password`, 12),
      };
    }),
  );

  const unitTypeDict: Record<number, UnitType> = {
    0: UnitType.VOLUME,
    1: UnitType.WEIGHT,
    2: UnitType.QUANTITY,
  };

  const unitsData = scrapedData.units.map((x) => {
    const type = unitTypeDict[x.type] || UnitType.QUANTITY;
    return {
      title: x.title,
      abbreviation: x.abbreviation.slice(0, 8),
      type,
    };
  });

  const ingredientsData = scrapedData.ingredients.map((x) => {
    const unitTypes = x.unit_types.map(
      (x) => unitTypeDict[x] || UnitType.QUANTITY,
    );
    return {
      title: x.title,
      unitTypes,
    };
  });

  const recipeImagesData = await Promise.all(
    scrapedData.recipe_images.map(async (x) => {
      return {
        url: x,
        mimeType: await getMimeTypeFromUrl(x),
      };
    }),
  );

  prisma.$transaction(async (tx) => {
    /* USERS */
    await tx.$executeRaw`TRUNCATE TABLE "users" CASCADE;`;
    const users = await prisma.$transaction(
      usersData.map((data) => prisma.user.create({ data })),
    );

    for (const u of users) {
      await tx.list.create({
        data: {
          author: {
            connect: {
              id: u.id,
            },
          },
          favouritesOfUser: {
            connect: {
              id: u.id,
            },
          },
          title: "Favorites",
        },
      });
    }

    /* UNITS */
    await tx.$executeRaw`TRUNCATE TABLE "units" CASCADE;`;
    /* const units = */ await prisma.$transaction(
      unitsData.map((data) => prisma.unit.create({ data })),
    );

    /* INGREDIENTS */
    await tx.$executeRaw`TRUNCATE TABLE "ingredients" CASCADE;`;
    /* const ingredients = */ await prisma.$transaction(
      ingredientsData.map((data) => prisma.ingredient.create({ data })),
    );

    /* RECIPE IMAGES */
    await tx.$executeRaw`TRUNCATE TABLE "files" CASCADE;`;
    /* const files = */ await prisma.$transaction(
      recipeImagesData.map((data) => prisma.file.create({ data })),
    );

    /* RECIPIES */
    await tx.$executeRaw`TRUNCATE TABLE "recipes" CASCADE;`;
    // for (const recipeData of scrapedData.recipes) {
    // }
  });
}

main();
