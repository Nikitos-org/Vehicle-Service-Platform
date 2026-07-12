import Link from 'next/link';

import type { PaginationSearchParams } from '@/features/pagination/model/types/pagination.types';
import { PaginationNav } from '@/features/pagination/components/pagination-nav';
import { CreateVehicleForm } from '@/features/vehicles/components/create-vehicle-form';
import { VehicleList } from '@/features/vehicles/components/vehicle-list';
import type { VehiclesPageData } from '@/features/vehicles/model/types/vehicles.types';

import type { UserListItem } from '../model/types/users.types';

import { DeleteUserButton } from './delete-user-button';
import { UpdateUserForm } from './update-user-form';

interface UserProfileProps {
  searchParams?: PaginationSearchParams;
  user: UserListItem;
  vehiclesPage: VehiclesPageData;
}

export function UserProfile({
  searchParams,
  user,
  vehiclesPage,
}: UserProfileProps) {
  const vehicles = vehiclesPage.items;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#f8fafc_0%,#e2e8f0_45%,#cbd5e1_100%)] px-6 py-16">
      <div className="mx-auto grid max-w-6xl gap-6">
        <section className="rounded-[2.25rem] border border-white/70 bg-white/72 p-6 shadow-[0_22px_60px_rgba(15,23,42,0.06)] backdrop-blur-sm lg:p-8">
          <Link
            href="/users"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            Back to users
          </Link>

          <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="flex flex-col gap-5 rounded-[1.75rem] border border-slate-200/80 bg-white/80 p-5 sm:flex-row sm:items-center">
              {user.avatar ? (
                <div
                  aria-label={`${user.name} avatar`}
                  className="h-20 w-20 rounded-3xl bg-slate-200 bg-cover bg-center"
                  role="img"
                  style={{ backgroundImage: `url(${user.avatar})` }}
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-900 text-2xl font-semibold text-white">
                  {user.name.slice(0, 1).toUpperCase()}
                </div>
              )}

              <div className="space-y-1">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
                  User profile
                </p>
                <h1 className="text-3xl font-semibold text-slate-950">
                  {user.name}
                </h1>
                <p className="text-base text-slate-600">{user.email}</p>
              </div>
            </div>

            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[1.75rem] border border-slate-200/80 bg-slate-50/85 p-4">
                <dt className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                  User ID
                </dt>
                <dd className="mt-2 break-all text-sm text-slate-900">
                  {user.id}
                </dd>
              </div>

              <div className="rounded-[1.75rem] border border-slate-200/80 bg-slate-50/85 p-4">
                <dt className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                  Avatar
                </dt>
                <dd className="mt-2 break-all text-sm text-slate-900">
                  {user.avatar ?? 'Not set'}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <UpdateUserForm user={user} />
        <CreateVehicleForm userId={user.id} />

        <section className="rounded-[2rem] border border-white/70 bg-white/72 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-sm lg:p-7">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
                Assigned vehicles
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">
                Linked transport
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Vehicles currently assigned to this user record.
              </p>
            </div>
          </div>

          <VehicleList compact hideOwnerMeta vehicles={vehicles} />

          <PaginationNav
            className="mt-6"
            meta={vehiclesPage.meta}
            pathname={`/users/${user.id}`}
            searchParams={searchParams}
          />
        </section>

        <DeleteUserButton userId={user.id} />
      </div>
    </main>
  );
}
