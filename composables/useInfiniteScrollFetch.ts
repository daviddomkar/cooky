import type { UseInfiniteScrollOptions } from "@vueuse/core";

export const useInfiniteScrollFetch = <T>(
  url: string,
  el: Ref<HTMLElement | null>,
  {
    take,
    where,
    ...infiniteScrollOptions
  }: PaginationParams & UseInfiniteScrollOptions = {},
) => {
  const nextCursor = ref<string | undefined>();
  const data = ref<T[]>([]) as Ref<T[]>;
  const error = ref<any>(undefined);
  const hasMore = ref(true);

  const { isLoading } = useInfiniteScroll(
    el,
    async () => {
      if (!hasMore.value) return;

      try {
        const result = await $fetch<PaginationResult<T>>(url, {
          query: {
            ...where,
            take,
            nextCursor: nextCursor.value,
          },
        });

        data.value?.push(...result.data);
        nextCursor.value = result.pagination.nextCursor;
        hasMore.value = !!result.pagination.nextCursor;
      } catch (e) {
        error.value = e;
      }
    },
    infiniteScrollOptions,
  );

  return {
    data,
    pending: isLoading,
    error,
  };
};
