import type {
  PaginateBase,
  PaginatedResult,
  PaginateMeta,
} from '@vsp/backend-shared/paginate';

export type PaginationMeta = PaginateMeta;
export type PaginatedResponse<TItem> = PaginatedResult<TItem>;

export type PaginationSearchParams = Record<
  string,
  string | string[] | undefined
>;

export type PaginationResolvedSearchParams = PaginationSearchParams;
export type PaginationSearchParamsInput =
  | PaginationResolvedSearchParams
  | Promise<PaginationResolvedSearchParams>;

export type PaginationParams = PaginateBase;

export type PaginationItem =
  | {
      type: 'page';
      page: number;
      isActive: boolean;
    }
  | {
      type: 'ellipsis';
      key: string;
    };
