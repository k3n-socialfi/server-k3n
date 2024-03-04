import { HttpStatus } from '@nestjs/common';

export const enum ErrorsCodes {
  NOT_FOUND = 4001,
  ALREADY_EXISTS = 4002,
  PERMISSION_ERROR = 4003,
}

export const ErrorsMap = {
  [ErrorsCodes.NOT_FOUND]: {
    statusCode: HttpStatus.NOT_FOUND,
    message: 'not found'
  },
  [ErrorsCodes.ALREADY_EXISTS]: {
    statusCode: HttpStatus.CONFLICT,
    message: 'already exists'
  },
  [ErrorsCodes.PERMISSION_ERROR]: {
    statusCode: HttpStatus.UNAUTHORIZED,
    message: 'Permissions error'
  }

};

export interface ISystemError {
  message: string;
  statusCode: ErrorsCodes;
}
