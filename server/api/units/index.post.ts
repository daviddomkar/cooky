import { getServerSession } from "#auth";
import { useValidatedBody } from "h3-valibot";
import { authOptions } from "../auth/[...]";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event, authOptions);

  if (!session || !session.user.permissions.includes(permissions.UnitsCreate)) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized.",
    });
  }

  const { title, type, abbreviation } = await useValidatedBody(
    event,
    UnitSchema,
  );

  await prisma.unit.create({
    data: {
      title,
      type,
      abbreviation,
    },
  });

  setResponseStatus(event, 201);
});
