import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "src/user/entity/user.entity";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<UserRole>('role', context.getHandler());

    if (!requiredRole) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user: { role: UserRole } }>();
    const user = request.user;

    if (!user || user.role !== requiredRole) {
      throw new ForbiddenException('Access denied. You are not authorized to perform this action.');
    }

    return true;
  }
}