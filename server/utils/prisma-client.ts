import {
  PrismaClient,
  type Recipe,
  Prisma,
  type RecipeIngredient,
} from "@prisma/client";

type RecipeIngredientInput = Omit<RecipeIngredient, "recipeId">;

export const prisma = new PrismaClient().$extends({
  model: {
    recipe: {
      async create(data: {
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
      }) {
        const {
          title,
          description,
          state,
          steps,
          nutritionPerServing,
          numberOfServings,
          imageId,
          authorId,
          recipeIngredients,
          categories,
          preparationDuration: {
            days = 0,
            hours = 0,
            minutes = 0,
            seconds = 0,
          },
        } = data;

        const preparationDurationSQL = `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
        const recipeIngredientsSQL = Prisma.join(
          recipeIngredients.map(
            ({ amount, ingredientId, unitId }) =>
              Prisma.sql`(${amount}, ${ingredientId}::uuid, ${unitId}::uuid)`,
          ),
        );
        const categoriesSQL = Prisma.join(categories);

        type CreateRecipeOutput = {
          o_id: string;
          o_slug: string;
          o_created_at: Date;
          o_updated_at: Date;
        };

        const result = await prisma.$queryRaw<CreateRecipeOutput[]>`
          CALL create_recipe(
            ${title}::character varying,
            ${description},
            ${preparationDurationSQL}::interval,
            ${state}::recipe_state,
            ${steps},
            ${nutritionPerServing}::integer,
            ${numberOfServings}::integer,
            ${imageId}::uuid,
            ${authorId}::uuid,
            ARRAY[${recipeIngredientsSQL}]::recipe_ingredient_input[],
            ARRAY[${categoriesSQL}]::uuid[],
            NULL,
            NULL,
            NULL,
            NULL
          )
        `;

        return {
          id: result[0].o_id,
          title,
          slug: result[0].o_slug,
          description,
          state,
          steps,
          nutritionPerServing,
          numberOfServings,
          imageId,
          authorId,
          createdAt: result[0].o_created_at,
          updatedAt: result[0].o_updated_at,
        } satisfies Recipe;
      },
      findRandom() {
        return prisma.randomRecipe.findFirst();
      },
      async findRandomInCategory(categoryId: string) {
        type FindRandomRecipeInCategoryOutput = {
          id: string;
          title: string;
          slug: string;
          description: string;
          preparation_duration: string;
          state: Recipe["state"];
          steps: PrismaJson.Step[];
          nutrition_per_serving: number;
          number_of_servings: number;
          image_id: string;
          author_id: string;
          author_username: string;
          created_at: Date;
          updated_at: Date;
        };

        const result = await prisma.$queryRaw<
          FindRandomRecipeInCategoryOutput[]
        >`
          SELECT id, title, slug, description, preparation_duration::text, state, steps, nutrition_per_serving, number_of_servings, image_id, author_id, author_username, created_at, updated_at FROM find_random_recipe_in_category(${categoryId}::uuid)
        `;

        if (result.length === 0) {
          return null;
        }

        return {
          id: result[0].id,
          title: result[0].title,
          slug: result[0].slug,
          description: result[0].description,
          state: result[0].state,
          steps: result[0].steps,
          nutritionPerServing: result[0].nutrition_per_serving,
          numberOfServings: result[0].number_of_servings,
          imageId: result[0].image_id,
          authorId: result[0].author_id,
          author: {
            username: result[0].author_username,
          },
          createdAt: result[0].created_at,
          updatedAt: result[0].updated_at,
        } satisfies Recipe & {
          author: {
            username: string;
          };
        };
      },
    },
  },
});
