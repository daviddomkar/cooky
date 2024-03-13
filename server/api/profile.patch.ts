import { createWriteStream, mkdir, existsSync } from "node:fs";
import { join } from "node:path";
import { Blob } from "node:buffer";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
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

  const { fileStoragePath } = useRuntimeConfig();

  await prisma.$transaction(async (tx) => {
    const file = await tx.file.create({
      data: {
        mimeType: profileImage.type,
        profileImageUser: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    const stream = profileImage.stream() as unknown as NodeJS.ReadableStream;

    if (!existsSync(fileStoragePath)) {
      await promisify(mkdir)(fileStoragePath, { recursive: true });
    }

    await promisify(pipeline)(
      stream,
      createWriteStream(join(fileStoragePath, file.id)),
    );
  });
});
