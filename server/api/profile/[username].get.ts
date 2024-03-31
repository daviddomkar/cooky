import { useValidatedParams } from "h3-valibot";
import { string, toTrimmed, objectAsync, minLength } from "valibot";

const ParametersSchema = objectAsync({
  username: string("This field is required.", [
    toTrimmed(),
    minLength(1, "This field is required."),
  ]),
});

export default defineEventHandler(async (event) => {
  const { username } = await useValidatedParams(event, ParametersSchema);

  const profile = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      // TODO: Add more fields here as needed on full profile page, we don't want to expose everything
      name: true,
      username: true,
      profileImageId: true,
      coverImageId: true,
      lists: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          recipes: {
            take: 1,
            select: {
              recipe: {
                select: {
                  imageId: true,
                },
              }
            },
          },
        },
      },
      recipes: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          slug: true,
          imageId: true,
        },
      },
    },
  });

  if (!profile) {
    throw createError({
      statusCode: 404,
      statusMessage: "Profile for the given username not found.",
    });
  }

  return {
    name: profile.name,
    username: profile.username,
    profileImageId: profile.profileImageId,
    coverImageId: profile.coverImageId,
    lists: profile.lists.filter((list) => list.recipes.length > 0).map((list) => ({
      id: list.id,
      title: list.title,
      imageId: list.recipes[0]!.recipe.imageId,
    })),
    recipes: profile.recipes,
  };
});
