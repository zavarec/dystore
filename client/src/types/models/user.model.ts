export interface User {
  id: string;
  phone?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  DIRECTOR = 'DIRECTOR',
  MANAGER = 'MANAGER',
  CUSTOMER = 'CUSTOMER',
}

export const UserRoleLabelsMap = {
  [UserRole.DIRECTOR]: 'Директор',
  [UserRole.MANAGER]: 'Менеджер',
  [UserRole.CUSTOMER]: 'Пользователь',
};
