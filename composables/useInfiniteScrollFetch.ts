import type { UseInfiniteScrollOptions } from "@vueuse/core";
import type { NitroFetchRequest, AvailableRouterMethod } from "nitropack";
import type { FetchError } from "ofetch";
import type {
  UseFetchOptions,
  FetchResult,
  AsyncDataRequestStatus,
} from "nuxt/app";

type GetMethod<R extends NitroFetchRequest, M = AvailableRouterMethod<R>> =
  AvailableRouterMethod<R> extends "get" ? M : never;

type PaginationData<
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

type FilterPaginationRequests<R extends NitroFetchRequest> = R extends string
  ? AvailableRouterMethod<R> extends GetMethod<R>
    ? FetchResult<R, AvailableRouterMethod<R>> extends PaginationData<R>
      ? R
      : never
    : never
  : never;

type PaginatedNitroFetchRequest = FilterPaginationRequests<NitroFetchRequest>;

type InfiniteScrollElement =
  | HTMLElement
  | SVGElement
  | Window
  | Document
  | null
  | undefined;

type UseInfiniteScrollFetchOptions<
  ReqT extends PaginatedNitroFetchRequest,
  DataT extends PaginationData<ReqT>,
  PickKeys extends KeysOf<DataT> = KeysOf<DataT>,
  E extends InfiniteScrollElement = InfiniteScrollElement,
> = UseFetchOptions<DataT, DataT, PickKeys, DataT, ReqT, GetMethod<ReqT>> &
  Omit<UseInfiniteScrollOptions<E>, "canLoadMore"> & {
    take?: number;
  };

export async function useInfiniteScrollFetch<
  ReqT extends PaginatedNitroFetchRequest,
  DataT extends PaginationData<ReqT>,
  ErrorT = FetchError,
  PickKeys extends KeysOf<DataT> = KeysOf<DataT>,
  E extends InfiniteScrollElement = InfiniteScrollElement,
>(
  element: MaybeRefOrGetter<E>,
  request: MaybeRefOrGetter<ReqT>,
  opts: UseInfiniteScrollFetchOptions<ReqT, DataT, PickKeys, E> = {},
): Promise<{
  data: Ref<DataT["results"]>;
  status: Ref<AsyncDataRequestStatus>;
  error: Ref<ErrorT | null>;
}> {
  const after = ref<string | null | undefined>(null);
  const data = ref([]) as Ref<DataT["results"]>;

  watch(toReactive(opts), () => {
    after.value = null;
  });

  const {
    data: currentData,
    status,
    error,
  } = await useFetch<
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

  data.value = (currentData.value as DataT).results;

  watch(currentData, (newData) => {
    if (!(newData as DataT)?.before) {
      data.value = (newData as DataT).results;
    } else {
      data.value = [...data.value, ...(newData as DataT).results];
    }
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
    data,
    status,
    error,
  };
}
