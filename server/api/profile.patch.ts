import { join } from "node:path";
import { Blob } from "node:buffer";
import { randomBytes } from "node:crypto";
import { getServerSession } from "#auth";
import { blob, maxSize, mimeType, object, parse, type Output } from "valibot";
import { authOptions } from "./auth/[...]";

const Schema = object({
  profileImage: blob("This field is required", [
    mimeType(
      ["image/jpeg", "image/png", "image/gif"],
      "The file must be an image (jpeg, png or gif)",
    ),
    maxSize(5 * 1024 * 1024, "The file size must be less than 5MB"),
  ]),
});

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event, authOptions);

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const formData = await readMultipartFormData(event);

  let parsedData: Output<typeof Schema>;

  try {
    parsedData = parse(
      Schema,
      formData?.reduce((acc, { name, data, type }) => {
        if (!name) {
          return acc;
        }

        acc[name] = new Blob([data], {
          type,
        });
        return acc;
      }, {} as any) ?? {},
    );

    // Handle errors if one occurs
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusText: "Bad Request",
      data: error,
    });
  }

  const profileImage = parsedData.profileImage as Blob;

  const {
    fileStorage: { path, secret },
  } = useRuntimeConfig();

  await prisma.$transaction(async (tx) => {
    const key = randomBytes(32);

    const file = await tx.file.create({
      data: {
        mimeType: profileImage.type,
        key: await fileStorage.encryptKey(secret, key),
        profileImageUser: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    await fileStorage.saveFile(join(path, file.id), profileImage, key);
  });
});
