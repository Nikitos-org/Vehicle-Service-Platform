import type { PaginationItem } from '../model/types/pagination.types';

interface BuildPaginationItemsOptions {
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
}

export function buildPaginationNav({
  currentPage,
  totalPages,
  siblingCount = 1,
}: BuildPaginationItemsOptions): PaginationItem[] {
  if (totalPages <= 0) {
    return [];
  }

  const pages = new Set<number>([1, totalPages]);

  for (
    let page = currentPage - siblingCount;
    page <= currentPage + siblingCount;
    page += 1
  ) {
    if (page >= 1 && page <= totalPages) {
      pages.add(page);
    }
  }

  const sortedPages = [...pages].sort((left, right) => left - right);
  const items: PaginationItem[] = [];

  sortedPages.forEach((page, index) => {
    const previousPage = sortedPages[index - 1];

    if (previousPage && page - previousPage > 1) {
      items.push({
        type: 'ellipsis',
        key: `ellipsis-${previousPage}-${page}`,
      });
    }

    items.push({
      type: 'page',
      page,
      isActive: page === currentPage,
    });
  });

  return items;
}
