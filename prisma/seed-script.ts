import fs from "fs";
import {
  Prisma,
  RecipeState,
  UnitType,
  type Recipe,
  type RecipeIngredient,
} from "@prisma/client";
import scrapedData from "./seed_data/scraped.json" assert { type: "json" };
import {
  customListTitles,
  notificationData,
  profileBanners,
  profileImages,
} from "./seed_data/fakeData";
import {
  generateRandomUniqueElements,
  randomElement,
  randomInteger,
} from "~/utils/random";

type RecipeIngredientInput = Omit<RecipeIngredient, "recipeId">;
type RecipeCreateInput = {
  title: string;
  description: string;
  preparationDuration: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  state: Recipe["state"];
  steps: PrismaJson.Step[];
  nutritionPerServing: number;
  numberOfServings: number;
  imageId: string;
  authorId: string;
  recipeIngredients: RecipeIngredientInput[];
  categories: string[];
};

type SeedData = {
  user: Prisma.UserCreateManyInput[];
  list: Prisma.ListCreateManyInput[];
  unit: Prisma.UnitCreateManyInput[];
  ingredient: Prisma.IngredientCreateManyInput[];
  file: Prisma.FileCreateManyInput[];
  category: Prisma.CategoryCreateManyInput[];
  recipe: RecipeCreateInput[];
  rating: Prisma.RatingCreateManyInput[];
  comment: Prisma.CommentCreateManyInput[];
  reply: Prisma.ReplyCreateManyInput[];
  commentHeart: Prisma.CommentHeartCreateManyInput[];
  replyHeart: Prisma.ReplyHeartCreateManyInput[];
  notification: Prisma.NotificationCreateManyInput[];
  recipeList: Prisma.RecipeListCreateManyInput[];
};

const seedData: SeedData = {
  user: [],
  list: [],
  unit: [],
  ingredient: [],
  file: [],
  category: [],
  recipe: [],
  rating: [],
  comment: [],
  reply: [],
  commentHeart: [],
  replyHeart: [],
  notification: [],
  recipeList: [],
};

async function getMimeTypeFromUrl(url: string) {
  const reponse = await fetch(url, {
    method: "HEAD",
  });
  return reponse.headers.get("Content-Type") ?? "image/jpeg";
}

function replaceAccentedCharacters(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036F]/g, "");
}

function saveToJSON(path: string, data: any) {
  fs.writeFileSync(path, JSON.stringify(data, null, 4));
}

async function main() {
  const usersData = await Promise.all(
    scrapedData.users.map((x) => {
      return {
        ...x,
        email: replaceAccentedCharacters(x.email),
        username: replaceAccentedCharacters(x.username),
        password: `${replaceAccentedCharacters(x.username)}password`,
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
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snacks",
    "Soups",
    "Sauces",
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

  /* RECIPE IMAGES */
  seedData.file = recipeImagesData;

  /* USERS */
  for (const i in usersData) {
    /* PROFILE PICTURES */
    let PFPIndex = null;
    if (Number(i) < profileImages.length) {
      const profileImgUrl = profileImages[Number(i)];
      seedData.file.push({
        url: profileImgUrl,
        mimeType: await getMimeTypeFromUrl(profileImgUrl),
      });
      PFPIndex = seedData.file.length - 1;
    }

    /* PROFILE BANNERS */
    let bannerIndex = null;
    if (Number(i) < profileBanners.length) {
      const bannerImgUrl = profileBanners[Number(i)];
      seedData.file.push({
        url: bannerImgUrl,
        mimeType: await getMimeTypeFromUrl(bannerImgUrl),
      });
      bannerIndex = seedData.file.length - 1;
    }
    seedData.user.push({
      ...usersData[i],
      profileImageId: PFPIndex as unknown as string,
      coverImageId: bannerIndex as unknown as string,
    });
  }

  /* FAVORITE_LISTS */
  seedData.list = seedData.user.map((_x, i) => {
    return {
      title: "Favorites",
      authorId: i as unknown as string,
    };
  });

  /* UNITS */
  seedData.unit = unitsData;

  /* INGREDIENTS */
  seedData.ingredient = ingredientsData;

  /* CATEGORIES */
  seedData.category = recipeCategoryDict.map((x) => {
    return {
      title: x,
      icon: x.toLowerCase(),
      slug: x.toLowerCase(),
    };
  });

  /* RECIPIES */
  for (const i in scrapedData.recipes) {
    const recipeData = scrapedData.recipes[i];
    /* INGREDIENTS */
    const recipeIngredients: RecipeIngredientInput[] =
      recipeData.ingredients.map((x) => {
        return {
          amount: Math.round(x.amount),
          ingredientId: x.ingredientId as unknown as string,
          unitId: x.unitId as unknown as string,
        };
      });

    /* RECIPIES */
    const recipeCategories = recipeData.categories as unknown as string[];
    const steps: PrismaJson.Step[] = recipeData.steps;
    const recipeCreateInput = {
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
      imageId: recipeData.imageId as unknown as string,
      authorId: recipeData.authorId as unknown as string,
    };

    seedData.recipe.push(recipeCreateInput);

    /* RATINGS */
    if (Math.random() > 0.2) {
      const randomRating = () => {
        return {
          numberOfStars: randomInteger(1, 5),
          recipeId: Number(i) as unknown as string,
          authorId: randomInteger(
            0,
            seedData.user.length - 1,
          ) as unknown as string,
        };
      };
      const randomRatings = generateRandomUniqueElements(
        randomInteger(1, 30),
        randomRating,
        (a, b) => a.authorId === b.authorId,
      );

      seedData.rating.push(...randomRatings);
    }

    /* COMMENTS */
    const commentIndexStart = seedData.comment.length;
    const replytIndexStart = seedData.reply.length;
    for (const j in recipeData.comments) {
      const comment = recipeData.comments[j];
      seedData.comment.push({
        authorId: comment.author as unknown as string,
        recipeId: Number(i) as unknown as string,
        content: comment.content,
      });
      /* REPLIES */
      seedData.reply.push(
        ...comment.replies.map((x) => {
          return {
            authorId: x.author as unknown as string,
            commentId: Number(j) as unknown as string,
            content: x.content,
          };
        }),
      );
    }
    /* COMMENT_HEARTS */
    const randomCommentHeart = () => {
      return {
        commentId: randomInteger(
          commentIndexStart,
          seedData.comment.length - 1,
        ) as unknown as string,
        authorId: randomInteger(
          0,
          seedData.user.length - 1,
        ) as unknown as string,
      };
    };
    const randomCommentHearts = generateRandomUniqueElements(
      randomInteger(0, seedData.comment.length - commentIndexStart),
      randomCommentHeart,
      (a, b) => a.authorId === b.authorId && a.commentId === b.commentId,
    );

    seedData.commentHeart.push(...randomCommentHearts);

    /* REPLY_HEARTS */
    if (seedData.reply.length > replytIndexStart) {
      const randomReplytHeart = () => {
        return {
          replyId: randomInteger(
            replytIndexStart,
            seedData.reply.length - 1,
          ) as unknown as string,
          authorId: randomInteger(
            0,
            seedData.user.length - 1,
          ) as unknown as string,
        };
      };
      const randomReplyHearts = generateRandomUniqueElements(
        randomInteger(0, seedData.reply.length - replytIndexStart),
        randomReplytHeart,
        (a, b) => a.authorId === b.authorId && a.replyId === b.replyId,
      );

      seedData.replyHeart.push(...randomReplyHearts);
    }
  }

  for (const i in seedData.user) {
    /* NOTIFICATIONS */
    if (Math.random() > 0.5) {
      const notifications = Array.from(Array(randomInteger(1, 5))).map(() =>
        randomElement(...notificationData),
      );
      seedData.notification.push(
        ...notifications.map((x) => {
          return {
            ...x,
            read: Math.random() > 0.5,
            userId: Number(i) as unknown as string,
          };
        }),
      );
    }

    /* FAVORITE LISTS */
    const favoriteRecipes = generateRandomUniqueElements(
      randomInteger(0, 5),
      () => randomInteger(0, seedData.recipe.length - 1),
      (a, b) => a === b,
    );

    const favListIndex = seedData.list.findIndex(
      (x) => (x.authorId as unknown as number) === Number(i),
    );

    if (favListIndex !== -1) {
      seedData.recipeList.push(
        ...favoriteRecipes.map((x) => {
          return {
            listId: favListIndex as unknown as string,
            recipeId: x as unknown as string,
          };
        }),
      );
    }

    /* CUSTOM LISTS */
    const titles = customListTitles
      .sort(() => Math.random() - 0.5)
      .slice(0, randomInteger(0, 5));

    for (const title of titles) {
      const randomRecipes = generateRandomUniqueElements(
        randomInteger(0, 5),
        () => randomInteger(0, seedData.recipe.length - 1),
        (a, b) => a === b,
      );
      seedData.list.push({
        title,
        authorId: Number(i) as unknown as string,
      });

      const customListIndex = seedData.list.length - 1;
      seedData.recipeList.push(
        ...randomRecipes.map((x) => {
          return {
            listId: customListIndex as unknown as string,
            recipeId: x as unknown as string,
          };
        }),
      );
    }
  }
  saveToJSON("./prisma/seed_data/seed.json", seedData);
}

main();
