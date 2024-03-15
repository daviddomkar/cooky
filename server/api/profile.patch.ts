import { createWriteStream, mkdir, existsSync } from "node:fs";
import { join } from "node:path";
import { Blob } from "node:buffer";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import { createCipheriv, randomBytes, pbkdf2 } from "node:crypto";
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

  const iv = randomBytes(16);

  await prisma.$transaction(async (tx) => {
    const file = await tx.file.create({
      data: {
        mimeType: profileImage.type,
        iv,
        profileImageUser: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    const salt = randomBytes(64);

    const key = await promisify(pbkdf2)(secret, salt, 2145, 32, "sha512");

    const stream = profileImage.stream() as unknown as NodeJS.ReadableStream;

    if (!existsSync(path)) {
      await promisify(mkdir)(path, { recursive: true });
    }

    const destination = createWriteStream(join(path, file.id));
    destination.write(iv);
    destination.write(salt);

    await promisify(pipeline)(
      stream,
      createCipheriv("aes-256-gcm", key, iv),
      destination,
    );
  });
});
