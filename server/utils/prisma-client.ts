import { PrismaClient, type Recipe, Prisma, UnitType } from "@prisma/client";
import { type Output /* is, instance, isoTimestamp, string */ } from "valibot";
import PaginationSchema from "../schemas/PaginationSchema";

type PrismaPaginationArgs<T> = Omit<
  Prisma.Args<T, "findMany">,
  "skip" | "take" | "cursor" | "orderBy"
> &
  Output<typeof PaginationSchema> & {
    cursor: {
      field: keyof Prisma.Payload<T, "findMany">["scalars"];
      direction: "asc" | "desc";
    };
  };

export type RecipeIngredientInput = {
  amount: Prisma.Decimal;
  unitId: string;
  ingredientId?: string;
  title?: string;
  unitTypes?: UnitType[];
};

type RecipeData = {
  title: string;
  description: string;
  preparationDuration: string;
  state: Recipe["state"];
  steps: PrismaJson.Step[];
  nutritionPerServing: number;
  numberOfServings: number;
  authorId: string;
  recipeIngredients: RecipeIngredientInput[];
  categories: string[];
  imageKey: Buffer;
  imageMimeType: string;
};

function encodeCursor(cursor: any) {
  /*
  if (is(instance(Date), cursor)) {
    cursor = cursor.toISOString();
  }
  */
  return Buffer.from(cursor).toString("base64");
}

function decodeCursor(encodedCursor: string) {
  const cursor: any = Buffer.from(encodedCursor, "base64").toString("utf-8");
  /*
  if (is(string([isoTimestamp()]), cursor)) {
    cursor = new Date(cursor);
  }
  */
  return cursor;
}

function constructRecipeIngredientsSQL(
  recipeIngredients: RecipeIngredientInput[],
) {
  if (recipeIngredients.length === 0) return null;

  return Prisma.join(
    recipeIngredients.map(
      ({ amount, ingredientId, unitId, title = "NULL", unitTypes = [] }) => {
        const unitTypesSQL =
          unitTypes.length > 0
            ? Prisma.sql`ARRAY[${Prisma.join(unitTypes, ", ")}]`
            : "{}";
        return Prisma.sql`(${amount}, ${ingredientId}::uuid, ${unitId}::uuid, ${title}, ${unitTypesSQL}::unit_types[])`;
      },
    ),
  );
}

export const prisma = new PrismaClient().$extends({
  model: {
    $allModels: {
      async paginate<T, A extends PrismaPaginationArgs<T>>(
        this: T,
        args: A,
      ): Promise<{
        results: Prisma.Result<T, A, "findMany">;
        after?: string;
        before?: string;
      }> {
        const context = Prisma.getExtensionContext(this) as any;

        const take = args.take ?? 10;
        const after = args.after ? decodeCursor(args.after) : undefined;
        const before = args.before ? decodeCursor(args.before) : undefined;

        const results = await context.findMany({
          // Pass all args except for 'after', 'before', 'skip', 'take', 'cursor' and 'orderBy'
          // since values are handled by the pagination logic.
          ...{
            ...(args as any),
            after: undefined,
            before: undefined,
            skip: undefined,
            take: undefined,
            cursor: undefined,
            orderBy: undefined,
          },
          // Skip cursor when we have a 'before' or 'after' cursor.
          skip: after || before ? 1 : undefined,
          // Take one extra item to determine if there are more items.
          // If we have a 'before' cursor, we need to reverse the order.
          take: before ? -take - 1 : take + 1,
          // Use the cursor if we have one.
          cursor:
            after || before
              ? { [args.cursor.field]: after ?? before }
              : undefined,
          // Order by the cursor field in the specified direction.
          orderBy: {
            [args.cursor.field]: args.cursor.direction,
          },
        });

        const hasMore = results.length > take;

        if (hasMore && !args.before) {
          results.pop();
        } else if (hasMore && args.before) {
          results.shift();
        }

        return {
          results,
          after:
            (hasMore && !args.before) || args.before
              ? encodeCursor(results[results.length - 1]?.[args.cursor.field])
              : undefined,
          before:
            (hasMore && args.before) || args.after
              ? encodeCursor(results[0]?.[args.cursor.field])
              : undefined,
        };
      },
    },
    recipe: {
      async findByUsernameAndSlug(username: string, slug: string) {
        const recipePromise = prisma.recipe.findFirst({
          include: {
            ingredients: {
              include: {
                ingredient: true,
                unit: true,
              },
            },
            categories: {
              select: {
                categoryId: true,
              },
            },
            author: {
              select: {
                username: true,
                name: true,
                profileImageId: true,
              },
            },
          },
          where: {
            slug,
            author: {
              username,
            },
          },
        });

        type RecipeDurationQueryOutput = {
          preparation_duration: string;
        };

        const durationQueryPromise = prisma.$queryRaw<
          RecipeDurationQueryOutput[]
        >`
          SELECT
            preparation_duration::text
          FROM recipes
          JOIN users ON recipes.author_id = users.id
          WHERE slug = ${slug} AND username = ${username}
        `;

        const [recipe, durationQuery] = await Promise.all([
          recipePromise,
          durationQueryPromise,
        ]);

        if (!recipe || !durationQuery?.length) {
          return null;
        }

        return {
          ...recipe,
          preparationDuration: durationQuery[0].preparation_duration,
        };
      },
      async create(data: RecipeData) {
        const {
          title,
          description,
          state,
          steps,
          nutritionPerServing,
          numberOfServings,
          authorId,
          recipeIngredients,
          categories,
          preparationDuration,
          imageKey,
          imageMimeType,
        } = data;

        const recipeIngredientsSQL =
          constructRecipeIngredientsSQL(recipeIngredients);

        const categoriesSQL = Prisma.join(categories);

        type CreateRecipeOutput = {
          o_id: string;
          o_slug: string;
          o_created_at: Date;
          o_updated_at: Date;
          o_image_id: string;
        };

        const result = await prisma.$queryRaw<CreateRecipeOutput[]>`
          CALL create_recipe(
            ${title}::character varying,
            ${description},
            ${preparationDuration}::interval,
            ${state}::recipe_state,
            ${steps},
            ${nutritionPerServing}::integer,
            ${numberOfServings}::integer,
            ${authorId}::uuid,
            ARRAY[${recipeIngredientsSQL}]::recipe_ingredient_input[],
            ARRAY[${categoriesSQL}]::uuid[],
            ${imageKey}::bytea,
            ${imageMimeType},
            NULL,
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
          imageId: result[0].o_image_id,
          authorId,
          createdAt: result[0].o_created_at,
          updatedAt: result[0].o_updated_at,
        } satisfies Recipe;
      },
      async update(id: string, data: RecipeData) {
        const {
          title,
          description,
          state,
          steps,
          nutritionPerServing,
          numberOfServings,
          authorId,
          recipeIngredients,
          categories,
          preparationDuration,
          imageKey,
          imageMimeType,
        } = data;

        const categoriesSQL = Prisma.join(categories);

        const recipeIngredientsSQL =
          constructRecipeIngredientsSQL(recipeIngredients);

        type UpdateRecipeOutput = {
          o_image_id: string;
          o_slug: string;
          o_created_at: Date;
          o_updated_at: Date;
        };

        const result = await prisma.$queryRaw<UpdateRecipeOutput[]>`
          CALL update_recipe(
            ${id}::uuid,
            ${title}::character varying,
            ${description},
            ${preparationDuration}::interval,
            ${state}::recipe_state,
            ${steps},
            ${nutritionPerServing}::integer,
            ${numberOfServings}::integer,
            ${authorId}::uuid,
            ARRAY[${recipeIngredientsSQL}]::recipe_ingredient_input[],
            ARRAY[${categoriesSQL}]::uuid[],
            ${imageKey}::bytea,
            ${imageMimeType},
            NULL,
            NULL,
            NULL,
            NULL
          )
        `;

        return {
          id,
          title,
          slug: result[0].o_slug,
          description,
          state,
          steps,
          nutritionPerServing,
          numberOfServings,
          imageId: result[0].o_image_id,
          authorId,
          createdAt: result[0].o_created_at,
          updatedAt: result[0].o_updated_at,
        } satisfies Recipe;
      },
      async findRandom() {
        const recipe = await prisma.randomRecipe.findFirst();

        if (!recipe) return null;

        return {
          id: recipe.id,
          title: recipe.title,
          slug: recipe.slug,
          description: recipe.description,
          state: recipe.state,
          steps: recipe.steps,
          nutritionPerServing: recipe.nutritionPerServing,
          numberOfServings: recipe.numberOfServings,
          imageId: recipe.imageId,
          authorId: recipe.authorId,
          author: {
            username: recipe.authorUsername,
            name: recipe.authorName,
            profileImageId: recipe.authorProfileImageId,
          },
          createdAt: recipe.createdAt,
          updatedAt: recipe.updatedAt,
        } satisfies Recipe & {
          author: {
            username: string;
            name: string;
            profileImageId?: string | null;
          };
        };
      },
      async findRandomInCategory(categorySlug: string) {
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
          author_name: string;
          author_profile_image_id?: string | null;
          created_at: Date;
          updated_at: Date;
        };

        const result = await prisma.$queryRaw<
          FindRandomRecipeInCategoryOutput[]
        >`
          SELECT id, title, slug, description, preparation_duration::text, state, steps, nutrition_per_serving, number_of_servings, image_id, author_id, author_username, author_name, author_profile_image_id, created_at, updated_at FROM find_random_recipe_in_category(${categorySlug})
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
            name: result[0].author_name,
            profileImageId: result[0].author_profile_image_id,
          },
          createdAt: result[0].created_at,
          updatedAt: result[0].updated_at,
        } satisfies Recipe & {
          author: {
            username: string;
            name: string;
            profileImageId?: string | null;
          };
        };
      },
    },
  },
});
