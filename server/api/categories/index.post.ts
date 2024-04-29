import { getServerSession } from "#auth";
import { useValidatedBody } from "h3-valibot";
import { authOptions } from "../auth/[...]";
import CategorySchema from "~/server/schemas/CategorySchema";
import permissions from "~/utils/permissions";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event, authOptions);

  if (
    !session ||
    !session.user.permissions.includes(permissions.CategoriesCreate)
  ) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized.",
    });
  }

  const { title, slug, icon, order } = await useValidatedBody(
    event,
    CategorySchema,
  );

  await prisma.category.create({
    data: {
      title,
      slug,
      icon,
      order,
    },
  });

  setResponseStatus(event, 201);
});
