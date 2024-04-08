const DEFAULT_TAKE = 10;

type PaginationData = {
  take?: number | null;
  backwards?: boolean | null;
  prevCursor?: string | null;
  nextCursor?: string | null;
};

type PaginateParams<T> = {
  prismaModel: {
    findMany: (where: any, ...args: any) => Promise<T[]>;
  };
  paginationData: PaginationData;
  where?: Record<string, any>;
  include?: Record<string, any>;
};

export async function usePagination<T extends { id: string }>({
  prismaModel,
  paginationData,
  where = {},
  include = {},
}: PaginateParams<T>) {
  const { take = DEFAULT_TAKE, backwards = false, ...cursors } = paginationData;
  let { prevCursor, nextCursor } = cursors;
  prevCursor = prevCursor
    ? Buffer.from(prevCursor, "base64").toString("utf-8")
    : undefined;
  nextCursor = nextCursor
    ? Buffer.from(nextCursor, "base64").toString("utf-8")
    : undefined;

  const adjustedTake = backwards ? -(Number(take) + 1) : Number(take) + 1;
  const cursor = backwards ? prevCursor : nextCursor;
  // Adjust skip logic: Skip only when paginating forwards with a 'nextCursor'.
  const skipCursor = backwards ? (prevCursor ? 1 : 0) : nextCursor ? 1 : 0;

  const data = await prismaModel.findMany({
    where,
    include,
    skip: skipCursor, // Adjusted skip logic
    take: adjustedTake,
    cursor: cursor ? { id: cursor as string } : undefined,
    orderBy: {
      id: "asc",
    },
  });

  const hasMore = data.length > Number(take);

  if (hasMore && !backwards) {
    data.pop();
  } else if (hasMore && backwards) {
    data.shift();
  }

  let newPrevCursor: string | undefined = data[0]?.id;

  if ((!prevCursor && !nextCursor) || (!hasMore && backwards)) {
    newPrevCursor = undefined;
  }

  let newNextCursor: string | undefined = data[data.length - 1]?.id;
  if (!hasMore && !backwards) {
    newNextCursor = undefined;
  }

  // Encode cursors to base64
  if (newPrevCursor)
    newPrevCursor = Buffer.from(newPrevCursor).toString("base64");
  if (newNextCursor)
    newNextCursor = Buffer.from(newNextCursor).toString("base64");

  return {
    data,
    pagination: {
      prevCursor: newPrevCursor,
      nextCursor: newNextCursor,
    },
  };
}
