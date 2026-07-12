import type { PaginationSearchParamsInput } from '@/features/pagination/model/types/pagination.types';
import { getPaginationParams } from '@/features/pagination/utils/get-pagination-params';
import { resolveSearchParams } from '@/features/pagination/utils/resolve-search-params';
import { getUsers } from '@/features/users/api/users.server';
import { UsersPage } from '@/features/users/components/users-page';

interface PageProps {
  searchParams?: PaginationSearchParamsInput;
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await resolveSearchParams(searchParams);
  const pagination = getPaginationParams(resolvedSearchParams, {
    defaultPageSize: 10,
    maxPageSize: 10,
  });
  const usersPage = await getUsers(pagination);

  return (
    <UsersPage searchParams={resolvedSearchParams} usersPage={usersPage} />
  );
}
