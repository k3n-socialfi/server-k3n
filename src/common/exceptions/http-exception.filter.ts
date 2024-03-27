import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Injectable,
  Logger,
  Inject,
  HttpStatus
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { FailureResponseDto } from './failure-response.dto';
import { ErrorsMap, ISystemError } from '@common/constants/respond-errors';

@Catch()
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const requestId = request.headers['requestId'] as string;

    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : null;

    const message = exceptionResponse ?? JSON.parse(exceptionResponse as string)?.message;

    let systemError: ISystemError;
    let finalResponse: FailureResponseDto;

    if (message?.statusCode >= 4000) {
      systemError = ErrorsMap[message?.message];

      finalResponse = {
        code: message?.statusCode || 5000,
        message: systemError?.message || 'unknown internal error',
        path: request.url,
        requestId: requestId,
        time: new Date().toISOString()
      };
    } else {
      let responseMsg;
      try {
        responseMsg = JSON.parse(message?.message);
      } catch (err) {
        responseMsg = message?.message || 'unknown internal error';
      }
      finalResponse = {
        code: message?.statusCode || 4000,
        message: responseMsg,
        path: request.url,
        requestId: requestId,
        time: new Date().toISOString()
      };
    }

    this.logger.debug(`Response:\n${JSON.stringify(finalResponse, null, 4)}`, HttpExceptionFilter.name);
    this.logger.log(`info: End RequestID: ${requestId}`, HttpExceptionFilter.name);

    return response.status(systemError?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json(finalResponse);
  }
}
