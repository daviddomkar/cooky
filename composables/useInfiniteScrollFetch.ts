import type { UseInfiniteScrollOptions } from "@vueuse/core";

export const useInfiniteScrollFetch = <T>(
  request: Parameters<typeof useFetch>[0],
  el: Ref<HTMLElement | null>,
  providedQuery: MaybeRefOrGetter<PaginationQuery> = {},
  infiniteScrollOptions: UseInfiniteScrollOptions = {},
) => {
  const nextCursor = ref<string | undefined>();
  const data = ref<T[]>([]) as Ref<T[]>;
  const error = ref<any>(undefined);
  const hasMore = ref(true);
  const isFetching = ref(false);
  const query = ref(toValue(providedQuery));

  watch(
    () => toValue(providedQuery),
    async (changedQuery) => {
      query.value = changedQuery;
      nextCursor.value = undefined;
      hasMore.value = true;
      isFetching.value = true;
      await fetchData(true);
      isFetching.value = false;
    },
  );

  const fetchData = async (replace?: boolean) => {
    try {
      const result = await $fetch<PaginationResult<T>>(toValue(request), {
        query: {
          ...query.value,
          nextCursor: nextCursor.value,
        },
      });

      if (replace) {
        data.value = result.data;
      } else {
        data.value?.push(...result.data);
      }

      nextCursor.value = result.pagination.nextCursor;
      hasMore.value = !!result.pagination.nextCursor;
    } catch (e) {
      error.value = e;
    }
  };

  const { isLoading } = useInfiniteScroll(el, () => fetchData(), {
    ...infiniteScrollOptions,
    canLoadMore: () => hasMore.value && !isFetching.value,
  });

  return {
    data,
    pending: isLoading,
    error,
  };
};
