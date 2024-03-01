import { HttpStatus } from '@nestjs/common';

export const OkMap = {
  SUCCESS: {
    HTTPStatus: HttpStatus.OK,
    code: 0,
    message: 'success'
  }
};
