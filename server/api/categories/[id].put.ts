import { getServerSession } from "#auth";
import { useValidatedBody, useValidatedParams } from "h3-valibot";
import { string, toTrimmed, objectAsync, uuid } from "valibot";
import { authOptions } from "../auth/[...]";

const ParametersSchema = objectAsync({
  id: string("id parameter is required.", [
    toTrimmed(),
    uuid("id parameter must be a valid UUID."),
  ]),
});

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event, authOptions);

  if (
    !session ||
    !session.user.permissions.includes(permissions.CategoriesUpdate)
  ) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized.",
    });
  }

  const { id } = await useValidatedParams(event, ParametersSchema);
  const { title, slug, icon } = await useValidatedBody(event, CategorySchema);

  await prisma.$transaction(async (tx) => {
    const category = await tx.category.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      throw createError({
        statusCode: 404,
        statusMessage: "Category not found.",
      });
    }

    await tx.category.update({
      where: {
        id,
      },
      data: {
        title,
        slug,
        icon,
      },
    });
  });
});
