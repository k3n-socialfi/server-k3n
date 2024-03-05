import { Role, RoleMap } from '@common/constants/enum';
import { ErrorsCodes, ErrorsMap } from '@common/constants/respond-errors';
import { Injectable, CanActivate, ExecutionContext, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role>('role', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        if (RoleMap[requiredRoles] > RoleMap[user?.role]) {
            throw new UnauthorizedException('Permissions error');
        }
        return true;
    }
}