export enum Gender {
  MALE = 0,
  FEMALE = 1,
}

export enum PropertyType {
  SINGLE_UNIT = 0,
  MULTIPLE_UNIT = 1,
}

export enum MaintainStatus {
  GOOD = 0,
  MAINTAINING = 1,
  BAD = 2,
}

export enum MemberContactType {
  TENANT = 0,
  SERVICE = 1,
}

export enum TransactionStatus {
  OPEN = 0,
  PAID = 1,
  PARTIAL = 2,
  OVERDUE = 3,
}

export const COOKIE_TOKEN = 'token';
