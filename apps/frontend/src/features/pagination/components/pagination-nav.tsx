import Link from 'next/link';

import { cn } from '@/utils/cn';

import type {
  PaginationMeta,
  PaginationSearchParams,
} from '../model/types/pagination.types';
import { buildPaginationNav } from '../utils/build-pagination-items';
import { createPageHref } from '../utils/create-page-href';

interface PaginationNavProps {
  className?: string;
  meta: PaginationMeta;
  pathname: string;
  searchParams?: PaginationSearchParams;
}

function linkClassName(isActive: boolean) {
  return cn(
    'inline-flex min-w-9 items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium transition',
    isActive
      ? 'border-slate-900 bg-slate-900 text-white'
      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50',
  );
}

export function PaginationNav({
  className,
  meta,
  pathname,
  searchParams,
}: PaginationNavProps) {
  if (meta.totalPages <= 1) {
    return null;
  }

  const items = buildPaginationNav({
    currentPage: meta.page,
    totalPages: meta.totalPages,
  });

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <Link
          aria-disabled={!meta.hasPreviousPage}
          className={cn(
            linkClassName(false),
            !meta.hasPreviousPage && 'pointer-events-none opacity-50',
          )}
          href={createPageHref(
            pathname,
            Math.max(meta.page - 1, 1),
            searchParams,
            meta.pageSize,
          )}
          prefetch={false}
          scroll={false}
        >
          Previous
        </Link>

        <div className="flex items-center gap-2">
          {items.map((item) =>
            item.type === 'ellipsis' ? (
              <span
                key={item.key}
                aria-hidden="true"
                className="inline-flex min-w-9 items-center justify-center px-1 text-sm text-slate-400"
              >
                ...
              </span>
            ) : (
              <Link
                key={item.page}
                aria-current={item.isActive ? 'page' : undefined}
                className={linkClassName(item.isActive)}
                href={createPageHref(
                  pathname,
                  item.page,
                  searchParams,
                  meta.pageSize,
                )}
                prefetch={false}
                scroll={false}
              >
                {item.page}
              </Link>
            ),
          )}
        </div>

        <Link
          aria-disabled={!meta.hasNextPage}
          className={cn(
            linkClassName(false),
            !meta.hasNextPage && 'pointer-events-none opacity-50',
          )}
          href={createPageHref(
            pathname,
            Math.min(meta.page + 1, meta.totalPages),
            searchParams,
            meta.pageSize,
          )}
          prefetch={false}
          scroll={false}
        >
          Next
        </Link>
      </div>

      <p className="text-sm text-slate-500">
        Page {meta.page} of {meta.totalPages}
      </p>
    </nav>
  );
}
