export const usePaginatedFetch = async <T>(
  url: string,
  providedQuery: MaybeRefOrGetter<PaginationQuery> = {},
) => {
  const prevCursor = ref<string | undefined>();
  const nextCursor = ref<string | undefined>();
  const data = ref<T[]>();
  const pending = ref(false);
  const error = ref<any>(undefined);
  const query = ref(providedQuery);

  const canGoBack = computed(() => !!prevCursor.value);
  const canGoForward = computed(() => !!nextCursor.value);

  const isInitialFetch = ref(true);

  watch(
    () => toValue(query),
    async (changedQuery) => {
      query.value = changedQuery;
      data.value = [];
      prevCursor.value = undefined;
      nextCursor.value = undefined;
      isInitialFetch.value = true;
      await next();
      isInitialFetch.value = false;
    },
  );

  const next = async () => {
    if (!canGoForward.value && !isInitialFetch.value) return;
    error.value = undefined;
    pending.value = true;

    try {
      const { data: records, pagination } = await $fetch<PaginationResult<T>>(
        url,
        {
          query: {
            ...query.value,
            prevCursor: prevCursor.value,
            nextCursor: nextCursor.value,
          },
        },
      );

      data.value = records;

      prevCursor.value = pagination.prevCursor;
      nextCursor.value = pagination.nextCursor;
    } catch (e) {
      error.value = e;
    } finally {
      pending.value = false;
    }
  };

  const previous = async () => {
    if (!canGoBack.value) return;
    error.value = undefined;
    pending.value = true;

    try {
      const { data: records, pagination } = await $fetch<PaginationResult<T>>(
        url,
        {
          query: {
            ...query.value,
            prevCursor: prevCursor.value,
            nextCursor: nextCursor.value,
            backwards: true,
          },
        },
      );

      data.value = records;

      prevCursor.value = pagination.prevCursor;
      nextCursor.value = pagination.nextCursor;
    } catch (e) {
      error.value = e;
    } finally {
      pending.value = false;
    }
  };

  // Initial fetch with useFetch
  const result = reactive(
    await useFetch<PaginationResult<T>>(url, {
      query: {
        ...query.value,
        prevCursor: prevCursor.value,
        nextCursor: nextCursor.value,
      },
    }),
  );

  data.value = result.data?.data;
  pending.value = result.pending;
  error.value = result.error;

  prevCursor.value = result.data?.pagination.prevCursor;
  nextCursor.value = result.data?.pagination.nextCursor;

  return {
    data,
    pending,
    error,
    next,
    previous,
    canGoBack,
    canGoForward,
  };
};
