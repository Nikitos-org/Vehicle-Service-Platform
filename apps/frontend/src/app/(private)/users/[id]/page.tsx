import type { PaginationSearchParamsInput } from '@/features/pagination/model/types/pagination.types';
import { getPaginationParams } from '@/features/pagination/utils/get-pagination-params';
import { resolveSearchParams } from '@/features/pagination/utils/resolve-search-params';
import { UserProfile } from '@/features/users/components/user-profile';
import { getUserDetailsPageData } from '@/features/users/server/get-user-details';

interface UserDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams?: PaginationSearchParamsInput;
}

export default async function UserDetailsPage({
  params,
  searchParams,
}: UserDetailsPageProps) {
  const { id } = await params;
  const resolvedSearchParams = await resolveSearchParams(searchParams);
  const pagination = getPaginationParams(resolvedSearchParams, {
    defaultPageSize: 5,
    maxPageSize: 5,
  });
  const { user, vehiclesPage } = await getUserDetailsPageData(id, pagination);

  return (
    <UserProfile
      searchParams={resolvedSearchParams}
      user={user}
      vehiclesPage={vehiclesPage}
    />
  );
}
