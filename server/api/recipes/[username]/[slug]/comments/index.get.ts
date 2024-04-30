import { useValidatedParams } from "h3-valibot";
import { string, objectAsync, toTrimmed, minLength } from "valibot";

const ParametersSchema = objectAsync({
  username: string("username parameter is required.", [
    toTrimmed(),
    minLength(1, "username parameter is required."),
  ]),
  slug: string("slug parameter is required.", [
    toTrimmed(),
    minLength(1, "slug parameter is required."),
  ]),
});

export default defineEventHandler(async (event) => {
  const { username, slug } = await useValidatedParams(event, ParametersSchema);

  const comments = await prisma.comment.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      recipe: {
        slug,
        author: {
          username,
        },
      },
    },
    include: {
      replies: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          hearts: {
            select: {
              author: {
                select: {
                  id: true,
                  username: true,
                },
              },
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
      },
      hearts: {
        select: {
          author: {
            select: {
              id: true,
              username: true,
            },
          },
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
  });

  return comments;
});
