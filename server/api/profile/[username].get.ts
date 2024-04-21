import { useValidatedParams } from "h3-valibot";
import { string, toTrimmed, objectAsync, minLength } from "valibot";

const ParametersSchema = objectAsync({
  username: string("username parameter is required.", [
    toTrimmed(),
    minLength(1, "username parameter is required."),
  ]),
});

export default defineEventHandler(async (event) => {
  const { username } = await useValidatedParams(event, ParametersSchema);

  const profile = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      name: true,
      username: true,
      profileImageId: true,
      coverImageId: true,
    },
  });

  if (!profile) {
    throw createError({
      statusCode: 404,
      statusMessage: "Profile for the given username not found.",
    });
  }

  return profile;
});
