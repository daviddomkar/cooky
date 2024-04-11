import type { UseInfiniteScrollOptions } from "@vueuse/core";
import type { UseFetchOptions, FetchResult } from "nuxt/app";
import type { FetchError } from "ofetch";
import type { NitroFetchRequest, AvailableRouterMethod } from "nitropack";

type FilterPaginationRequests<R extends NitroFetchRequest> = R extends string
  ? AvailableRouterMethod<R> extends "get"
    ? FetchResult<R, AvailableRouterMethod<R>> extends {
        after?: string | null;
        before?: string | null;
        results: any[];
      }
      ? R
      : never
    : never
  : never;

type GetMethod<R extends NitroFetchRequest, M = AvailableRouterMethod<R>> =
  AvailableRouterMethod<R> extends "get" ? M : never;

type PaginationDataT<
  R extends NitroFetchRequest,
  D = FetchResult<R, AvailableRouterMethod<R>>,
> =
  AvailableRouterMethod<R> extends "get"
    ? D extends {
        after?: string | null;
        before?: string | null;
        results: any[];
      }
      ? D
      : never
    : never;

type PaginatedNitroFetchRequest =
  | FilterPaginationRequests<NitroFetchRequest>
  | (string & {});

type InfiniteScrollElement =
  | HTMLElement
  | SVGElement
  | Window
  | Document
  | null
  | undefined;

type UseInfiniteScrollFetchOptions<
  ReqT extends PaginatedNitroFetchRequest,
  DataT extends PaginationDataT<ReqT>,
  PickKeys extends KeysOf<DataT> = KeysOf<DataT>,
  E extends InfiniteScrollElement = InfiniteScrollElement,
> = UseFetchOptions<DataT, DataT, PickKeys, DataT, ReqT, GetMethod<ReqT>> &
  Omit<UseInfiniteScrollOptions<E>, "canLoadMore"> & {
    take?: number;
  };

export async function useInfiniteScrollFetch<
  ReqT extends PaginatedNitroFetchRequest,
  DataT extends PaginationDataT<ReqT>,
  ErrorT = FetchError,
  PickKeys extends KeysOf<DataT> = KeysOf<DataT>,
  E extends InfiniteScrollElement = InfiniteScrollElement,
>(
  element: MaybeRefOrGetter<E>,
  request: MaybeRefOrGetter<ReqT>,
  opts: UseInfiniteScrollFetchOptions<ReqT, DataT, PickKeys, E> = {},
): Promise<{
  data: Ref<DataT["results"]>;
}> {
  const after = ref<string | undefined | null>(null);
  const results = ref([]) as Ref<DataT["results"]>;

  const { data: currentData, status } = await useFetch<
    DataT,
    ErrorT,
    ReqT,
    GetMethod<ReqT>,
    DataT,
    DataT,
    PickKeys,
    DataT
  >(request, {
    ...opts,
    query: {
      ...opts.query,
      take: opts.take,
      after,
    },
  });

  const currentAfter = computed(() => (currentData.value as DataT).after);

  results.value = (currentData.value as DataT).results;

  watch(currentData, (newData) => {
    const data = newData as DataT;
    results.value = [...results.value, ...data.results];
  });

  useInfiniteScroll(
    element,
    () => {
      after.value = currentAfter.value;
    },
    {
      ...opts,
      canLoadMore: () => !!currentAfter.value && status.value !== "pending",
    },
  );

  return {
    data: results,
  };
}

export const useInfiniteScrollFetchOld = <T>(
  url: string,
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
      const result = await $fetch<PaginationResult<T>>(url, {
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
