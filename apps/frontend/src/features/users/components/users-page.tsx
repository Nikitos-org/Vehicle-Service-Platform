import type { PaginationSearchParams } from '@/features/pagination/model/types/pagination.types';
import { PaginationNav } from '@/features/pagination/components/pagination-nav';

import type { UsersPageData } from '../model/types/users.types';

import { CreateUserForm } from './create-user-form';
import { UsersList } from './users-list';

interface UsersPageProps {
  searchParams?: PaginationSearchParams;
  usersPage: UsersPageData;
}

export function UsersPage({ searchParams, usersPage }: UsersPageProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#f8fafc_0%,#e2e8f0_45%,#cbd5e1_100%)] px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500">
              User service
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              Users
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Review the current user registry and create new records.
            </p>
          </div>
        </div>

        <div className="mb-8">
          <CreateUserForm />
        </div>

        <UsersList users={usersPage.items} />

        <PaginationNav
          className="mt-8"
          meta={usersPage.meta}
          pathname="/users"
          searchParams={searchParams}
        />
      </div>
    </main>
  );
}
