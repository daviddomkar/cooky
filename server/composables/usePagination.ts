const DEFAULT_TAKE = 10;

interface PaginationData {
  take?: number;
  lastItemId?: string;
}

interface PaginateParams<T> {
  prismaModel: {
    findMany: (where: any, ...args: any) => Promise<T[]>;
  };
  paginationData: PaginationData;
  where: Record<string, any>;
}

export async function usePagination<T extends { id: string }>({
  prismaModel,
  paginationData,
  where
}: PaginateParams<T>) {
  const { take = DEFAULT_TAKE, lastItemId } = paginationData
  const skipCursor = !!lastItemId;

  const data = await prismaModel.findMany({
    where,
    skip: skipCursor ? 1 : 0,
    take: take + 1,
    cursor: lastItemId ? { id: lastItemId } : undefined,
    orderBy: {
      id: 'asc'
    }
  });

  const hasMore = data.length > take;
  if (hasMore) data.pop();

  return {
    data,
    pagination: {
      lastItemId: data[data.length - 1].id,
      hasMore
    }
  };
}
