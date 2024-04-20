import { getServerSession } from "#auth";
import { useValidatedBody } from "h3-valibot";
import { authOptions } from "../auth/[...]";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event, authOptions);

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized.",
    });
  }

  const { title, visibility } = await useValidatedBody(event, ListSchema);

  const list = await prisma.list.create({
    data: {
      title,
      visibility,
      author: {
        connect: {
          id: session.user.id,
        },
      },
    },
  });

  setResponseStatus(event, 201);

  return {
    id: list.id,
  };
});
