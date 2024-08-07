import { getServerSession } from "#auth";
import { useValidatedBody } from "h3-valibot";
import { authOptions } from "../auth/[...]";

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

  const { title, slug, icon } = await useValidatedBody(event, CategorySchema);

  await prisma.category.create({
    data: {
      title,
      slug,
      icon,
    },
  });

  setResponseStatus(event, 201);
});
