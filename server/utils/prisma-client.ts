import { PrismaClient, type Recipe, Prisma } from "@prisma/client";

interface RecipeIngredient {
  ingredientId: string;
  unitId: string;
  amount: number;
}

export type Step = {
  order: number;
  content: string;
}

const prisma = new PrismaClient().$extends({
  model: {
    recipe: {
      async create(data: {
        title: string
        description: string
        preparationDuration: {
          days: number
          hours: number
          minutes: number
          seconds: number
        },
        state: Recipe["state"],
        steps: Step[]
        nutritionPerServing: number
        numberOfServings: number
        imageId: string
        authorId: string
        recipeIngredients: RecipeIngredient[]
        categories: string[]
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
            seconds = 0
          } 
        } = data;

        const preparationDurationSQL = `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
        const recipeIngredientsSQL = Prisma.join(recipeIngredients.map(({ ingredientId, unitId, amount }) => 
          Prisma.sql`(${ingredientId}::uuid, ${unitId}::uuid, ${amount})`
        ));
        const categoriesSQL = Prisma.join(categories);

        await prisma.$executeRaw`
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
            ARRAY[${recipeIngredientsSQL}]::recipe_ingredient_parameter_type[],
            ARRAY[${categoriesSQL}]::uuid[]
          )
        `;
      }
    }
  }
});

export default prisma;
