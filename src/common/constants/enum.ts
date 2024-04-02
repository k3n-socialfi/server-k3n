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
  Admin = 'admin'
}

export const RoleMap = {
  [Role.User]: 0,
  [Role.Admin]: 1
};

export const IntervalTime = {
  ['1d']: 86400,
  ['3d']: 259200,
  ['7d']: 604800
};
