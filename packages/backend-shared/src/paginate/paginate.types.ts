export type PaginateBase = {
  page: number;
  pageSize: number;
};

export type PaginateParams = PaginateBase & {
  skip: number;
  take: number;
};

export type PaginateMeta = PaginateBase & {
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type PaginatedResult<TItem> = {
  items: TItem[];
  meta: PaginateMeta;
};

export type PaginateOptions = {
  defaultPage?: number;
  defaultPageSize?: number;
  maxPageSize?: number;
};

export type BuildPaginatedResultParams<TItem> = PaginateBase & {
  items: TItem[];
  totalItems: number;
};
