import { Visibility } from "@prisma/client";
import { hash } from "bcrypt";
import { useValidatedBody } from "h3-valibot";

export default defineEventHandler(async (event) => {
  const { name, username, email, password } = await useValidatedBody(
    event,
    SignUpSchema,
  );

  await prisma.$transaction(async (tx) => {
    let user = await tx.user.findUnique({
      where: {
        username,
      },
    });

    if (user) {
      throw createError({
        statusCode: 409,
        statusMessage: "username already taken",
      });
    }

    user = await tx.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      throw createError({
        statusCode: 409,
        statusMessage: "email already taken",
      });
    }

    const hashedPassword = await hash(password, 12);

    user = await tx.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
      },
    });

    await tx.list.create({
      data: {
        author: {
          connect: {
            id: user.id,
          },
        },
        favouritesOfUser: {
          connect: {
            id: user.id,
          },
        },
        title: "Favorites",
        visibility: Visibility.PRIVATE,
      },
    });

    sendNoContent(event, 201);
  });
});
