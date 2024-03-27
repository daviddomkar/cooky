
import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { Blob } from "node:buffer";
import { join } from "node:path";
import { hash } from "bcrypt";
import { $Enums, Prisma } from "@prisma/client";
import seedData from "./seed.json" assert { type: "json" };
import { prisma } from "~/server/utils/prisma-client";
import { fileStorage } from "~/server/utils/file-storage";

const path = process.env.FILE_STORAGE_PATH;
const secret = process.env.FILE_STORAGE_SECRET;

async function main() {
  /* FILES */
  const files = await prisma.$transaction(async(tx) => {
    return await Promise.all(seedData.file.map(async ({ path: imagePath, mimeType}) => {
        const key = randomBytes(32);
        const blob = new Blob([readFileSync(imagePath)]);

        const file = await tx.file.create({
          data: {
            mimeType,
            key: await fileStorage.encryptKey(secret!, key),
          },
        });

        await fileStorage.saveFile(join(path!, file.id), blob, key);

        return file;
    }));
  });

  /* USER */
  const userDataPromise = seedData.user.map(async (user) => {
    return {
      ...user,
      password: await hash(`${user.username}password`, 12),
      profileImageId: user.profileImageId
        ? files[user.profileImageId].id
        : null,
      coverImageId: user.coverImageId ? files[user.coverImageId].id : null,
    };
  });
  const userData = await Promise.all(userDataPromise);

  const users = await prisma.$transaction(
    userData.map((data) => prisma.user.create({ data })),
  );

  /* UNITS */
  const unitData = seedData.unit as Prisma.UnitCreateInput[];
  const units = await prisma.$transaction(
    unitData.map((data) => prisma.unit.create({ data })),
  );

  /* INGREDIENTS */
  const IngredientData = seedData.ingredient as Prisma.IngredientCreateInput[];
  const ingredients = await prisma.$transaction(
    IngredientData.map((data) => prisma.ingredient.create({ data })),
  );

  /* CATEGORIES */
  const categoryData = seedData.category;
  const categories = await prisma.$transaction(
    categoryData.map((data) => prisma.category.create({ data })),
  );

  /* RECIPES */
  const recipeData = seedData.recipe.map((recipe) => {
    const recipeIngredients = recipe.recipeIngredients.map((ing) => {
      return {
        ...ing,
        unitId: units[ing.unitId].id,
        ingredientId: ingredients[ing.ingredientId].id,
      };
    });
    const recipeCategories = recipe.categories.map((cat) => categories[cat].id);
    return {
      ...recipe,
      categories: recipeCategories,
      recipeIngredients,
      state: recipe.state as $Enums.RecipeState,
      imageId: files[recipe.imageId].id,
      authorId: users[recipe.authorId].id,
    };
  });
  const createRecipes = recipeData.map((data) => prisma.recipe.create(data));
  const recipes = await Promise.all(createRecipes);

  /* RATINGS */
  const ratingData = seedData.rating.map((rating) => {
    return {
      ...rating,
      authorId: users[rating.authorId].id,
      recipeId: recipes[rating.recipeId].id,
    };
  });
  await prisma.$transaction(
    ratingData.map((data) => prisma.rating.create({ data })),
  );

  /* COMMENTS */
  const commentData = seedData.comment.map((comment) => {
    return {
      ...comment,
      authorId: users[comment.authorId].id,
      recipeId: recipes[comment.recipeId].id,
    };
  });
  const comments = await prisma.$transaction(
    commentData.map((data) => prisma.comment.create({ data })),
  );

  /* REPLIES */
  const replyData = seedData.reply.map((reply) => {
    return {
      ...reply,
      authorId: users[reply.authorId].id,
      commentId: comments[reply.commentId].id,
    };
  });
  const replies = await prisma.$transaction(
    replyData.map((data) => prisma.reply.create({ data })),
  );

  /* COMMENT_HEARTS */
  const commentHeartData = seedData.commentHeart.map((commentHeart) => {
    return {
      ...commentHeart,
      authorId: users[commentHeart.authorId].id,
      commentId: comments[commentHeart.commentId].id,
    };
  });
  await prisma.$transaction(
    commentHeartData.map((data) => prisma.commentHeart.create({ data })),
  );

  /* REPLY_HEARTS */
  const replyHeartData = seedData.replyHeart.map((replyHeart) => {
    return {
      ...replyHeart,
      authorId: users[replyHeart.authorId].id,
      replyId: replies[replyHeart.replyId].id,
    };
  });
  await prisma.$transaction(
    replyHeartData.map((data) => prisma.replyHeart.create({ data })),
  );

  /* NOTIFICATIONS */
  const notificationData = seedData.notification.map((notification) => {
    return {
      ...notification,
      userId: users[notification.userId].id,
    };
  });
  await prisma.$transaction(
    notificationData.map((data) => prisma.notification.create({ data })),
  );

  /* LISTS */
  const listData = seedData.list.map((list) => {
    return {
      ...list,
      authorId: users[list.authorId].id,
    };
  });
  const lists = await prisma.$transaction(
    listData.map((data) => prisma.list.create({ data })),
  );

  /* RECIPE_LIST */
  const recipeListData = seedData.recipeList.map((recipeList) => {
    return {
      ...recipeList,
      listId: lists[recipeList.listId].id,
      recipeId: recipes[recipeList.recipeId].id,
    };
  });
  await prisma.$transaction(
    recipeListData.map((data) => prisma.recipeList.create({ data })),
  );
}

main();
