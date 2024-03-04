export enum LoggerType {
  CLI = 'queue',
  APP = 'application'
}

export enum JwtType {
  Access,
  Refresh
}

export const enum Role {
  User = 'user',
  Admin = 'admin',
}

export const RoleMap = {
  [Role.User]: 0,
  [Role.Admin]: 1,
};