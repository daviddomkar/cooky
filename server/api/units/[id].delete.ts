import { getServerSession } from "#auth";
import { useValidatedParams } from "h3-valibot";
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
    !session.user.permissions.includes(permissions.CategoriesDelete)
  ) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized.",
    });
  }

  const { id } = await useValidatedParams(event, ParametersSchema);

  await prisma.$transaction(async (tx) => {
    const unit = await tx.unit.findUnique({
      where: {
        id,
      },
    });

    if (!unit) {
      throw createError({
        statusCode: 404,
        statusMessage: "Category not found.",
      });
    }

    await prisma.unit.delete({
      where: {
        id,
      },
    });
  });
});
