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

        const result = await prisma.$queryRaw<
          {
            o_id: string;
            o_slug: string;
            o_created_at: Date;
            o_updated_at: Date;
          }[]
        >`
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
          slug: result[0].o_slug,
          title,
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
    },
  },
});
