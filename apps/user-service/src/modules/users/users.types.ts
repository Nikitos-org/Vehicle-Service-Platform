export type UserCreatedEvent = {
  id: string;
  email: string;
  createdByAdminId: string | null;
};
