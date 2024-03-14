import { RecipeState, UnitType, type RecipeIngredient } from "@prisma/client";
import { hash } from "bcrypt";
import scrapedData from "./seed_data/scraped.json" assert { type: "json" };
import { prisma } from "~/server/utils/prisma-client";
import {
  generateRandomUniqueElements,
  randomElement,
  randomInteger,
} from "~/utils/random";

type RecipeIngredientInput = Omit<RecipeIngredient, "recipeId">;

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

  const unitTypeDict: UnitType[] = [
    UnitType.VOLUME,
    UnitType.WEIGHT,
    UnitType.QUANTITY,
  ];

  const recipeStateDict: RecipeState[] = [
    RecipeState.DRAFT,
    RecipeState.PUBLISHED,
  ];

  const recipeCategoryDict: string[] = [
    "BREAKFAST",
    "LUNCH",
    "DINNER",
    "SNACKS",
    "SOUPS",
    "SAUCES",
  ];

  const unitsData = scrapedData.units.map((x) => {
    const type = unitTypeDict[x.type] ?? UnitType.QUANTITY;
    return {
      title: x.title,
      abbreviation: x.abbreviation.slice(0, 8),
      type,
    };
  });

  const ingredientsData = scrapedData.ingredients.map((x) => {
    const unitTypes = x.unitTypes.map(
      (x) => unitTypeDict[x] ?? UnitType.QUANTITY,
    );
    return {
      title: x.title,
      unitTypes,
    };
  });

  const recipeImagesData = await Promise.all(
    scrapedData.recipeImages.map(async (x) => {
      return {
        url: x,
        mimeType: await getMimeTypeFromUrl(x),
      };
    }),
  );

  /* USERS */
  const users = await prisma.$transaction(
    usersData.map((data) => prisma.user.create({ data })),
  );

  for (const u of users) {
    await prisma.list.create({
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
  const units = await prisma.$transaction(
    unitsData.map((data) => prisma.unit.create({ data })),
  );

  /* INGREDIENTS */
  const ingredients = await prisma.$transaction(
    ingredientsData.map((data) => prisma.ingredient.create({ data })),
  );

  /* RECIPE IMAGES */
  const files = await prisma.$transaction(
    recipeImagesData.map((data) => prisma.file.create({ data })),
  );

  /* CATEGORIES */
  const categories = await prisma.$transaction(
    recipeCategoryDict.map((data) =>
      prisma.category.create({
        data: {
          title: data,
          icon: data,
        },
      }),
    ),
  );

  /* RECIPIES */
  for (const recipeData of scrapedData.recipes) {
    /* INGREDIENTS */
    const recipeIngredients: RecipeIngredientInput[] =
      recipeData.ingredients.map((x) => {
        return {
          amount: Math.round(x.amount),
          ingredientId: ingredients[x.ingredientId].id,
          unitId: units[x.unitId].id,
        };
      });

    /* RECIPIES */
    const recipeCategories = recipeData.categories.map((x) => categories[x].id);
    const steps: PrismaJson.Step[] = recipeData.steps;
    const recipe = await prisma.recipe.create({
      title: recipeData.title,
      description: recipeData.description ?? "",
      preparationDuration: {
        days: 0,
        hours: 0,
        minutes: recipeData.preparationDurationMinutes ?? 20,
        seconds: 0,
      },
      state: recipeStateDict[recipeData.state] ?? RecipeState.PUBLISHED,
      nutritionPerServing: recipeData.nutritionPerServing,
      numberOfServings: recipeData.numberOfServings ?? 1,

      categories: recipeCategories,
      recipeIngredients,
      steps,
      imageId: files[recipeData.imageId].id,
      authorId: users[recipeData.authorId].id,
    });
    /* RATINGS */
    if (Math.random() > 0.2) {
      const randomRating = () => {
        return {
          numberOfStars: randomInteger(0, 9),
          recipeId: recipe.id,
          authorId: randomElement(...users).id,
        };
      };
      const randomRatings = generateRandomUniqueElements(
        randomInteger(1, 30),
        randomRating,
        (a, b) => a.authorId === b.authorId,
      );
      await prisma.rating.createMany({
        data: randomRatings,
      });
    }

    /* COMMENTS */
    const comments = await prisma.$transaction(
      recipeData.comments.map((c) =>
        prisma.comment.create({
          data: {
            content: c.content,
            authorId: users[c.author].id,
            recipeId: recipe.id,
            /* REPLIES */
            replies: {
              create: c.replies.map((r) => {
                return {
                  authorId: users[r.author].id,
                  content: r.content,
                };
              }),
            },
          },
          include: { recipe: true },
        }),
      ),
    );
    /* COMMENT_HEARTS */
    const randomCommentHeart = () => {
      return {
        commentId: randomElement(...comments).id,
        authorId: randomElement(...users).id,
      };
    };
    const randomCommentHearts = generateRandomUniqueElements(
      randomInteger(0, comments.length),
      randomCommentHeart,
      (a, b) => a.authorId === b.authorId && a.commentId === b.commentId,
    );
    await prisma.commentHeart.createMany({ data: randomCommentHearts });

    /* REPLY_HEARTS */
    const randomReply = await prisma.reply.findFirst({
      where: {
        comment: {
          recipeId: recipe.id,
        },
      },
    });
    if (randomReply) {
      const randomReplytHeart = () => {
        return {
          replyId: randomReply.id,
          authorId: randomElement(...users).id,
        };
      };
      await prisma.replyHeart.create({ data: randomReplytHeart() });
    }
  }
}

main();
