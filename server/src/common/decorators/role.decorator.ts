import { SetMetadata } from "@nestjs/common";
import { Role } from "@prisma/client";

export const ROLES_KEY = "roles";
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

// Удобные алиасы
export const DirectorOnly = () => SetMetadata(ROLES_KEY, [Role.DIRECTOR]);
export const ManagerOnly = () => SetMetadata(ROLES_KEY, [Role.MANAGER]);
export const CustomerOnly = () => SetMetadata(ROLES_KEY, [Role.CUSTOMER]);
