import type { PaginationSearchParams } from '@/features/pagination/model/types/pagination.types';
import { PaginationNav } from '@/features/pagination/components/pagination-nav';

import type { VehiclesPageData } from '../model/types/vehicles.types';

import { VehicleList } from './vehicle-list';

interface VehiclesPageProps {
  searchParams?: PaginationSearchParams;
  vehiclesPage: VehiclesPageData;
}

export function VehiclesPage({
  searchParams,
  vehiclesPage,
}: VehiclesPageProps) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#e2e8f0_100%)] px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-slate-500">
              Vehicle registry
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-950">
              Transport vehicles
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Administrative view of all registered transport vehicles. Open the
              owner profile to inspect the full linked user record.
            </p>
          </div>
        </div>

        <VehicleList showOwnerLink vehicles={vehiclesPage.items} />

        <PaginationNav
          className="mt-8"
          meta={vehiclesPage.meta}
          pathname="/vehicles"
          searchParams={searchParams}
        />
      </div>
    </main>
  );
}
