import type {
  PaginationResolvedSearchParams,
  PaginationSearchParamsInput,
} from '../model/types/pagination.types';

export async function resolveSearchParams(
  searchParams?: PaginationSearchParamsInput,
): Promise<PaginationResolvedSearchParams | undefined> {
  return searchParams ? await Promise.resolve(searchParams) : undefined;
}

export function getSearchParamValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}
