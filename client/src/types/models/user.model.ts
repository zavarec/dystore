export interface User {
  id: number;
  phone?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  role: UserRole;
}

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}