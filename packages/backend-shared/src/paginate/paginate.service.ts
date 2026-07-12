import { Injectable } from '@nestjs/common';

import type {
  BuildPaginatedResultParams,
  PaginatedResult,
  PaginateMeta,
  PaginateOptions,
  PaginateParams,
} from './paginate.types.js';

@Injectable()
export class PaginateService {
  private readonly defaultPage = 1;
  private readonly defaultPageSize = 10;
  private readonly maxPageSize = 100;

  resolve({
    page,
    pageSize,
    options,
  }: {
    page?: number;
    pageSize?: number;
    options?: PaginateOptions;
  }): PaginateParams {
    const resolvedPage = this.normalizePage(page, options);
    const resolvedPageSize = this.normalizePageSize(pageSize, options);

    return {
      page: resolvedPage,
      pageSize: resolvedPageSize,
      skip: (resolvedPage - 1) * resolvedPageSize,
      take: resolvedPageSize,
    };
  }

  private normalizePage(page?: number, options?: PaginateOptions) {
    const defaultPage = this.toPositiveInteger(
      options?.defaultPage,
      this.defaultPage,
    );

    const normalizedPage = this.toPositiveInteger(page, defaultPage);

    return Math.max(normalizedPage, 1);
  }

  private normalizePageSize(pageSize?: number, options?: PaginateOptions) {
    const defaultPageSize = this.toPositiveInteger(
      options?.defaultPageSize,
      this.defaultPageSize,
    );

    const maxPageSize = this.toPositiveInteger(
      options?.maxPageSize,
      this.maxPageSize,
    );

    const normalizedPageSize = this.toPositiveInteger(
      pageSize,
      defaultPageSize,
    );

    return Math.min(Math.max(normalizedPageSize, 1), maxPageSize);
  }

  private toPositiveInteger(value: number | undefined, fallback: number) {
    if (value === undefined || !Number.isFinite(value)) {
      return fallback;
    }

    return Math.floor(value);
  }

  buildMeta({
    page,
    pageSize,
    totalItems,
  }: Omit<BuildPaginatedResultParams<never>, 'items'>): PaginateMeta {
    const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize);

    return {
      page,
      pageSize,
      totalItems,
      totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
    };
  }

  buildPaginatedResult<TItem>({
    items,
    page,
    pageSize,
    totalItems,
  }: BuildPaginatedResultParams<TItem>): PaginatedResult<TItem> {
    return {
      items,
      meta: this.buildMeta({
        page,
        pageSize,
        totalItems,
      }),
    };
  }
}
