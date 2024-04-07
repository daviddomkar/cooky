import type { UseInfiniteScrollOptions } from "@vueuse/core";

export const useInfiniteScrollFetch = <T>(
  request: Parameters<typeof useFetch<T>>[0],
  el: Ref<HTMLElement | null>,
  providedQuery: MaybeRefOrGetter<PaginationQuery> = {},
  infiniteScrollOptions: UseInfiniteScrollOptions = {},
) => {
  const nextCursor = ref<string | undefined>();
  const data = ref<T[]>([]) as Ref<T[]>;
  const error = ref<any>(undefined);
  const hasMore = ref(true);
  const isFetching = ref(false);
  const query = ref(providedQuery);

  watch(
    () => toValue(query),
    async (changedQuery) => {
      query.value = changedQuery;
      data.value = [];
      nextCursor.value = undefined;
      hasMore.value = true;
      isFetching.value = true;
      await infiniteScrollCallback();
      isFetching.value = false;
    },
  );

  const infiniteScrollCallback = async () => {
    try {
      const result = await $fetch<PaginationResult<T>>(toValue(request), {
        query: {
          ...query.value,
          nextCursor: nextCursor.value,
        },
      });

      data.value?.push(...result.data);
      nextCursor.value = result.pagination.nextCursor;
      hasMore.value = !!result.pagination.nextCursor;
    } catch (e) {
      error.value = e;
    }
  };

  const { isLoading } = useInfiniteScroll(el, infiniteScrollCallback, {
    ...infiniteScrollOptions,
    canLoadMore: () => hasMore.value && !isFetching.value,
  });

  return {
    data,
    pending: isLoading,
    error,
  };
};
