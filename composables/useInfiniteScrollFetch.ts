import type { UseInfiniteScrollOptions } from "@vueuse/core";
import type { AsyncData, UseFetchOptions, FetchResult } from "nuxt/app";
import type { FetchError } from "ofetch";
import type { NitroFetchRequest, AvailableRouterMethod } from "nitropack";

type InfiniteScrollElement =
  | HTMLElement
  | SVGElement
  | Window
  | Document
  | null
  | undefined;

type UseInfiniteScrollFetchOptions<
  _ResT,
  DataT,
  PickKeys extends KeysOf<DataT>,
  DefaultT,
  ReqT extends NitroFetchRequest,
  Method extends AvailableRouterMethod<ReqT>,
  E extends InfiniteScrollElement = InfiniteScrollElement,
> = UseFetchOptions<_ResT, DataT, PickKeys, DefaultT, ReqT, Method> &
  Omit<UseInfiniteScrollOptions<E>, "canLoadMore"> & {
    take?: number;
  };

type FilterPaginationRequests<R extends NitroFetchRequest> = R extends string
  ? FetchResult<R, AvailableRouterMethod<R>> extends {
      after?: string;
      before?: string;
      results: any[];
    }
    ? R
    : never
  : never;

type PaginatedNitroFetchRequest = FilterPaginationRequests<NitroFetchRequest>;

export async function useInfiniteScrollFetch<
  ResT = void,
  ErrorT = FetchError,
  ReqT extends PaginatedNitroFetchRequest = PaginatedNitroFetchRequest,
  Method extends AvailableRouterMethod<ReqT> = ResT extends void
    ? "get" extends AvailableRouterMethod<ReqT>
      ? "get"
      : AvailableRouterMethod<ReqT>
    : AvailableRouterMethod<ReqT>,
  _ResT = ResT extends void ? FetchResult<ReqT, Method> : ResT,
  DataT = _ResT,
  PickKeys extends KeysOf<DataT> = KeysOf<DataT>,
  DefaultT = DataT,
  E extends InfiniteScrollElement = InfiniteScrollElement,
>(
  element: MaybeRefOrGetter<E>,
  request: MaybeRefOrGetter<ReqT>,
  opts: UseInfiniteScrollFetchOptions<
    _ResT,
    DataT,
    PickKeys,
    DefaultT,
    ReqT,
    Method,
    E
  > = {},
): Promise<{
  data: AsyncData<PickFrom<DataT, PickKeys> | DefaultT, ErrorT | null>["data"];
}> {
  const after = ref<string | null>(null);
  const data = ref() as Ref<DefaultT | PickFrom<DataT, PickKeys>>;

  const { data: currentData, refresh } = await useFetch<
    ResT,
    ErrorT,
    ReqT,
    Method,
    _ResT,
    DataT,
    PickKeys,
    DefaultT
  >(request, {
    ...opts,
    query: {
      ...opts.query,
      take: 20,
      after,
    },
  });

  watch(
    currentData,
    (newData) => {
      data.value = newData;
      console.log("newData", newData);
    },
    { immediate: true },
  );

  useInfiniteScroll(
    element,
    async () => {
      if (after.value) {
        await refresh();
      }
    },
    {
      ...opts,
      canLoadMore: () => !!after.value,
    },
  );

  return {
    data,
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
