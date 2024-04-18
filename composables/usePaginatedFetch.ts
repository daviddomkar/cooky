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
  AvailableRouterMethod<R> extends GetMethod<R>
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

type UsePaginatedFetchOptions<
  ReqT extends PaginatedNitroFetchRequest,
  DataT extends PaginationData<ReqT>,
  PickKeys extends KeysOf<DataT> = KeysOf<DataT>,
> = UseFetchOptions<DataT, DataT, PickKeys, DataT, ReqT, GetMethod<ReqT>> & {
  take?: number;
};

export async function usePaginatedFetch<
  ReqT extends PaginatedNitroFetchRequest,
  DataT extends PaginationData<ReqT>,
  ErrorT = FetchError,
  PickKeys extends KeysOf<DataT> = KeysOf<DataT>,
>(
  request: MaybeRefOrGetter<ReqT>,
  opts: UsePaginatedFetchOptions<ReqT, DataT, PickKeys> = {},
): Promise<{
  data: Ref<DataT["results"]>;
  status: Ref<AsyncDataRequestStatus>;
  error: Ref<ErrorT | null>;
  next: Ref<(() => void) | null>;
  previous: Ref<(() => void) | null>;
}> {
  const after = ref<string | null | undefined>(null);
  const before = ref<string | null | undefined>(null);

  watch(toReactive(opts), () => {
    before.value = null;
    after.value = null;
  });

  const { data, status, error } = await useFetch<
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
      before,
    },
  });

  const currentAfter = computed(() => (data.value as DataT).after);
  const currentBefore = computed(() => (data.value as DataT).before);

  const results = computed(() => (data.value as DataT).results);

  const next = computed(() => {
    if (!currentAfter.value) return null;
    return () => {
      after.value = currentAfter.value;
    };
  });

  const previous = computed(() => {
    if (!currentBefore.value) return null;
    return () => {
      before.value = currentBefore.value;
    };
  });

  return { data: results, status, error, next, previous };
}
