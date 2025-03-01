import { SetMetadata } from "@nestjs/common";
import { UserRole } from "src/user/entity/user.entity";

export const Roles = (role: UserRole) => SetMetadata('role', role);