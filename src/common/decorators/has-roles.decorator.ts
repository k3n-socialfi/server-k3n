import { Role } from '@common/constants/enum';
import { SetMetadata } from '@nestjs/common';

export const HasRoles = (role: Role) => SetMetadata('role', role);