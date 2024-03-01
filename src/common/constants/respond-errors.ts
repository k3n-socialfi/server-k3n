import { HttpStatus } from '@nestjs/common';

export const enum ErrorsCodes {
  NOT_FOUND = 404
}

export const ErrorsMap = {
  [ErrorsCodes.NOT_FOUND]: {
    HTTPStatus: HttpStatus.NOT_FOUND,
    message: 'not found'
  }
};

export interface ISystemError {
  message: string;
  HTTPStatus: HttpStatus;
}
