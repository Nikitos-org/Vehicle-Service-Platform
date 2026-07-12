import type { PaginationSearchParamsInput } from '@/features/pagination/model/types/pagination.types';
import { getPaginationParams } from '@/features/pagination/utils/get-pagination-params';
import {
  getSearchParamValue,
  resolveSearchParams,
} from '@/features/pagination/utils/resolve-search-params';
import { getVehicles } from '@/features/vehicles/api/vehicles.server';
import { VehiclesPage } from '@/features/vehicles/components/vehicles-page';

interface PageProps {
  searchParams?: PaginationSearchParamsInput;
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await resolveSearchParams(searchParams);
  const pagination = getPaginationParams(resolvedSearchParams, {
    defaultPageSize: 10,
    maxPageSize: 10,
  });
  const userId = getSearchParamValue(resolvedSearchParams?.userId);
  const vehiclesPage = await getVehicles({
    ...pagination,
    userId,
  });

  return (
    <VehiclesPage
      searchParams={resolvedSearchParams}
      vehiclesPage={vehiclesPage}
    />
  );
}
