interface PaginationData {
  take?: number;
  where?: Record<string, any>;
}

interface Data<T> {
  data: T[];
  pagination: {
    prevCursor?: string;
    nextCursor?: string;
  }
}

export const usePaginatedFetch = async <T>(url: string, { take, where }: PaginationData = {}) => {
  const prevCursor = ref<string | undefined>();
  const nextCursor = ref<string | undefined>();
  const data = ref<T[]>();
  const pending = ref(false);
  const error = ref<any>(undefined);

  const canGoBack = computed(() => !!prevCursor.value);
  const canGoForward = computed(() => !!nextCursor.value);

  const next = async () => {
    if (!canGoForward.value) return;
    error.value = undefined;
    pending.value = true;

    try {
      const { data: records, pagination } = await $fetch<Data<T>>(url, {
        query: {
          ...where,
          take,
          prevCursor: prevCursor.value,
          nextCursor: nextCursor.value
        }
      });

      data.value = records;

      prevCursor.value = pagination.prevCursor;
      nextCursor.value = pagination.nextCursor;
    } catch (e) {
      error.value = e;
    } finally {
      pending.value = false;
    }
  }

  const previous = async () => {
    if (!canGoBack.value) return;
    error.value = undefined;
    pending.value = true;

    try {
      const { data: records, pagination } = await $fetch<Data<T>>(url, {
        query: {
          ...where,
          take,
          prevCursor: prevCursor.value,
          nextCursor: nextCursor.value,
          backwards: true
        }
      });

      data.value = records;

      prevCursor.value = pagination.prevCursor;
      nextCursor.value = pagination.nextCursor;
    } catch (e) {
      error.value = e;
    } finally {
      pending.value = false;
    }
  }

  // Initial fetch with useFetch
  const result = reactive(
    await useFetch<Data<T>>(url, {
      query: {
        ...where,
        take,
        prevCursor: prevCursor.value,
        nextCursor: nextCursor.value
      }
    })
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
    canGoForward
  }
}
