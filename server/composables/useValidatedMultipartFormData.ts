import { H3Event } from "h3";
import { BaseSchemaAsync, Output, parseAsync } from "valibot";

export default async function <T extends BaseSchemaAsync>(
  event: H3Event,
  schema: T,
): Promise<Output<T>> {
  try {
    const multipartFormData = await readMultipartFormDataAsBlobs(event);

    return parseAsync(schema, multipartFormData);
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: error,
    });
  }
}

export async function readMultipartFormDataAsBlobs(event: H3Event) {
  const multipartFormData = await readMultipartFormData(event);

  // Reduce the multipart form data to a single object with Blobs
  return (
    multipartFormData?.reduce(
      (acc, { name, data, type }) => {
        if (!name) return acc;
        acc[name] = new Blob([data], { type });
        return acc;
      },
      {} as { [key: string]: Blob },
    ) ?? {}
  );
}
