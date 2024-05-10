export enum LoggerType {
  CLI = 'queue',
  APP = 'application'
}

export enum JwtType {
  Access,
  Refresh
}

export enum Role {
  User = 'user',
  Admin = 'admin',
  Kol = 'kol'
}

export const RoleMap = {
  [Role.User]: 0,
  [Role.Admin]: 1,
  [Role.Kol]: 2
};

export const IntervalTime = {
  ['1d']: 86400,
  ['3d']: 259200,
  ['7d']: 604800
};
